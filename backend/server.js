import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Storage setup
const storage = multer.diskStorage({
    destination: "tempFiles/",
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });
const files = new Map(); // Temporary storage in memory

const uploadedFiles = []; // Store uploaded file details

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { expiry } = req.body;
    const fileId = uuidv4();
    const expiryTime = expiry ? parseInt(expiry) * 60 * 1000 : 10 * 60 * 1000;

    files.set(fileId, { path: req.file.path, originalName: req.file.originalname });
    uploadedFiles.push({
        id: fileId,
        name: req.file.originalname,
        link: `http://localhost:${PORT}/download/${fileId}`,
        expiry: new Date(Date.now() + expiryTime).toLocaleTimeString()
    });

    setTimeout(() => {
        fs.unlink(req.file.path, () => {
            files.delete(fileId);
            uploadedFiles.splice(uploadedFiles.findIndex(f => f.id === fileId), 1);
        });
    }, expiryTime);

    res.json({ downloadLink: `http://localhost:${PORT}/download/${fileId}` });
});

// Get all uploaded files
app.get("/files", (req, res) => {
    res.json(uploadedFiles);
});


// Download route (preserve file type)
app.get("/download/:id", (req, res) => {
    const fileData = files.get(req.params.id);
    if (!fileData) return res.status(404).json({ error: "File not found or expired" });

    res.download(fileData.path, fileData.originalName, () => {
        fs.unlink(fileData.path, () => files.delete(req.params.id)); // Auto-delete after download
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
