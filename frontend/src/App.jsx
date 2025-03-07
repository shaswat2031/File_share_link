import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import React from "react";

function App() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const res = await axios.get("http://localhost:5000/files");
            setFiles(res.data);
        };
        fetchFiles();
    }, [files]); // Re-fetch whenever files change

    return (
        <div className="container">
            <h1>Temporary File Sharing</h1>
            <FileUpload />

            <h2>Uploaded Files</h2>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <strong>{file.name}</strong> - Expires at: {file.expiry}  
                        <a href={file.link} target="_blank" rel="noopener noreferrer">Download</a>
                        <button onClick={() => navigator.clipboard.writeText(file.link)}>Copy</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
