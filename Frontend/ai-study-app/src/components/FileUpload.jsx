// src/FileUpload.js
import React, { useState } from 'react';
import api from '../config/api';
import './FileUpload.css';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');

        if (validFiles.length === 0) {
            setFiles([]);
            setError('Please select valid PDF files');
        } else {
            setFiles(validFiles);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one PDF file');
            return;
        }

        setLoading(true);
        setError(null);
        setSummary('');
        setProgress(0);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });

        try {
            const response = await api.post('/api/summarize/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            if (response.data && response.data.summary) {
                setSummary(response.data.summary);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.response) {
                setError(error.response.data || 'Failed to upload file. Please try again.');
            } else if (error.request) {
                setError('No response from server. Please check if the backend is running.');
            } else {
                setError('Failed to upload file. Please try again.');
            }
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="file-upload-container">
            <h2>Upload PDFs for Summarization</h2>
            <div className="file-upload-box">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    multiple
                    className="file-input"
                    id="file-input"
                />
                <label htmlFor="file-input" className="file-input-label">
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Choose PDF files'}
                </label>
                <button
                    onClick={handleUpload}
                    disabled={loading || files.length === 0}
                    className="upload-button"
                >
                    {loading ? 'Processing...' : 'Upload and Summarize'}
                </button>
                {loading && (
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        />
                        <span className="progress-text">{progress}%</span>
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {summary && (
                <div className="summary-container">
                    <h3>Summary:</h3>
                    <div className="summary-content">
                        {summary.split('\n\n').map((part, index) => (
                            <div key={index} className="summary-part">
                                {part}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
