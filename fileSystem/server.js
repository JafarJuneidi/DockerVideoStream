"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const port = 3002;
const UPLOAD_DIRECTORY = path_1.default.join(__dirname, '/files');
if (!fs_1.default.existsSync(UPLOAD_DIRECTORY)) {
    fs_1.default.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.get('/hi', (_, res) => {
    res.json("Hello");
});
app.post('/upload', upload.single('file'), (req, res) => {
    var _a;
    res.json({ filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname });
});
app.get('/download/:filename', (req, res) => {
    res.download(path_1.default.join(UPLOAD_DIRECTORY, req.params.filename));
});
app.get('/stream/:filename', (req, res) => {
    const filePath = path_1.default.join(UPLOAD_DIRECTORY, req.params.filename);
    const stat = fs_1.default.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs_1.default.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs_1.default.createReadStream(filePath).pipe(res);
    }
});
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
