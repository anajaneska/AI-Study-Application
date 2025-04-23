// src/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
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
            setSummary(response.data.summary);
            setError('');
        } catch (err) {
            setError("Error uploading file. Please try again.");
            setSummary('');
        }
    };

    return (
        <div>
            <h2>Upload a PDF to Summarize</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {summary && <div><h3>Summary:</h3><p>{summary}</p></div>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default FileUpload;
