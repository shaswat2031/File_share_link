import { useState } from "react";
import axios from "axios";
import DownloadLink from "./DownloadLink";
import React from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [expiry, setExpiry] = useState(10); // Default expiry 10 min

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("expiry", expiry);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData);
            setLink(res.data.downloadLink);
        } catch (err) {
            console.error(err);
            alert("Upload failed, try again.");
        }
    };

    return (
        <div className="upload-container">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            
            <select onChange={(e) => setExpiry(e.target.value)}>
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
