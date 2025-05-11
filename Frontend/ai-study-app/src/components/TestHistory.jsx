import React from 'react';
import './TestHistory.css';

const TestHistory = ({ testHistory, onViewTest, onDeleteTest }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="test-history">
            <h3>Test History</h3>
            {testHistory.length === 0 ? (
                <p>No tests taken yet.</p>
            ) : (
                <ul className="history-list">
                    {testHistory.map((test) => (
                        <li key={test.id} className="history-item">
                            <div className="test-info">
                                <div className="test-date">
                                    {formatDate(test.testDate)}
                                </div>
                                <div className="test-score">
                                    <div className="score-circle">
                                        {test.score}%
                                    </div>
                                </div>
                                <div className="test-details">
                                    <p>Correct Answers: {test.correctAnswers} / {test.totalQuestions}</p>
                                </div>
                            </div>
                            <div className="test-actions">
                                <button
                                    onClick={() => onViewTest(test)}
                                    className="view-test-button"
                                >
                                    View Test
                                </button>
                                <button
                                    onClick={() => onDeleteTest(test.id)}
                                    className="delete-test-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TestHistory; 