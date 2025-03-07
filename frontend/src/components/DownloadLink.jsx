import React from "react";
const DownloadLink = ({ link }) => {
    return (
        <div className="download-container">
            <p>Download Link:</p>
            <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
            </a>
            <button onClick={() => navigator.clipboard.writeText(link)}>Copy</button>
        </div>
    );
};

export default DownloadLink;
