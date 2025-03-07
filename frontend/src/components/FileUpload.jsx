import { useState } from "react";
import axios from "axios";
import DownloadLink from "./DownloadLink";
import React from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [expiry, setExpiry] = useState(10); // Default expiry 10 min
    const [fileName, setFileName] = useState(""); // To display file name

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("expiry", parseInt(expiry)); // Convert to integer

        try {
            const res = await axios.post("https://filebackend-egisej53m-prasadshaswat123s-projects.vercel.app/upload", formData);
            setLink(res.data.downloadLink);
        } catch (err) {
            console.error(err);
            alert("Upload failed, please try again.");
        }
    };

    return (
        <div className="upload-container">
            <input 
                type="file" 
                accept="image/*, application/pdf, application/zip, text/plain" // Allows only certain file types
                onChange={handleFileChange} 
            />
            
            {fileName && <p>Selected File: {fileName}</p>} {/* Display selected file name */}

            <select onChange={(e) => setExpiry(parseInt(e.target.value))}>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
            </select>

            <button onClick={handleUpload}>Upload</button>
            {link && <DownloadLink link={link} />}
        </div>
    );
};

export default FileUpload;
