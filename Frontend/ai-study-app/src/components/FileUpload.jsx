// src/FileUpload.js
import React, { useState } from 'react';
import api from '../config/api';
import './FileUpload.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError('Please select a valid PDF file');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);
        setSummary('');
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

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
            <h2>Upload PDF for Summarization</h2>
            <div className="file-upload-box">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".pdf"
                    className="file-input"
                    id="file-input"
                />
                <label htmlFor="file-input" className="file-input-label">
                    {file ? file.name : 'Choose a PDF file'}
                </label>
                <button 
                    onClick={handleUpload} 
                    disabled={loading || !file}
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

