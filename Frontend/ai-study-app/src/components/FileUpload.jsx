// src/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [files, setFiles] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError("Please select at least one PDF file.");
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });

        try {
            const response = await axios.post("http://localhost:8080/api/summarize/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSummaries(response.data);
            setError('');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Error uploading files. Please try again.");
            setSummaries({});
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px' }}>Upload PDFs to Summarize</h2>

            <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginBottom: '15px',
                    width: '300px'
                }}
            />

            <button
                onClick={handleUpload}
                style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '20px'
                }}
            >
                Upload
            </button>

            {Object.keys(summaries).length > 0 && (
                <div style={{ maxWidth: '800px' }}>
                    <h3>Summaries:</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {Object.entries(summaries).map(([filename, summary]) => (
                            <li key={filename} style={{ marginBottom: '20px' }}>
                                <strong>{filename}</strong>
                                <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '5px' }}>
                                    {summary}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p style={{ color: "red", marginTop: '10px' }}>{error}</p>}
        </div>
    );
}
export default FileUpload;