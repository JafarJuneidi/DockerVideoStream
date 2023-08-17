import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 3001;

// Use the cors middleware
app.use(cors());

// Create a connection pool to the database
const pool = mysql.createPool({
    host: 'containerization-mysql-db-1',
    // host: 'localhost',
    port: 3306,
    user: 'myuser',
    password: 'mypassword',
    database: 'file_info',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/getFiles', (req, res) => {
    // Use the connection to query the database
    pool.query('SELECT * FROM files', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


app.get('/hi', (req, res) => {
    res.json("Hello");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

