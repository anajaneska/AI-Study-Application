// src/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [downloadLink, setDownloadLink] = useState(''); // Add state for the download link
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/api/summarize/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            // Set the summary if available
            setSummary(response.data.summary);
            // Set the download link returned by the backend
            setDownloadLink(response.data.downloadUrl);
            setError('');
        } catch (err) {
            setError("Error uploading file. Please try again.");
            setSummary('');
            setDownloadLink(''); // Clear download link on error
        }
    };

    return (
        <div>
            <h2>Upload a PDF to Summarize</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {summary && <div><h3>Summary:</h3><p>{summary}</p></div>}
            {downloadLink && (
                <div>
                    <h3>Download Summary:</h3>
                    <a href={`http://localhost:8080${downloadLink}`} target="_blank" rel="noopener noreferrer">
                        Click here to download your summary
                    </a>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default FileUpload;

