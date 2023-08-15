import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();
const port = 3000;
const UPLOAD_DIRECTORY = path.join(__dirname, '/files');

if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    res.json({ filename: req.file?.originalname });
});

app.get('/download/:filename', (req: Request, res: Response) => {
    res.download(path.join(UPLOAD_DIRECTORY, req.params.filename));
});

app.get('/stream/:filename', (req: Request, res: Response) => {
    const filePath = path.join(UPLOAD_DIRECTORY, req.params.filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
