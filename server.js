// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Storage setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Upload settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed!'), false);
        }
    }
});

// Route to upload PDFs
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.send(`PDF uploaded: ${req.file.filename}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
