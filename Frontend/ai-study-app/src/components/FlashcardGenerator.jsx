import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TestHistory from './TestHistory';
import './FlashcardGenerator.css';
import {
    getSummaries,
    getFlashcards,
    generateFlashcards,
    deleteFlashcards,
    deleteSummary,
    getTestHistory,
    saveTestResult,
    deleteTest
} from '../services/flashcardService';
import { downloadFlashcards } from '../services/flashcardService';

const FlashcardGenerator = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summaries, setSummaries] = useState([]);
    const [selectedSummaryId, setSelectedSummaryId] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [testMode, setTestMode] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [hasFlashcards, setHasFlashcards] = useState(false);
    const [testHistory, setTestHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const location = useLocation();

    useEffect(() => {
        fetchSummaries();
        loadTestHistory();
    }, [selectedSummaryId]);

    const fetchSummaries = async () => {
        try {
            const response = await getSummaries();
            console.log('Fetched summaries:', response.data);
            setSummaries(response.data);
        } catch (error) {
            console.error('Error fetching summaries:', error);
            setError('Failed to load summaries');
        }
    };

    const loadTestHistory = async () => {
        if (!selectedSummaryId) return;

        try {
            const response = await getTestHistory(selectedSummaryId);
            console.log('Test history response:', response.data);
            setTestHistory(response.data);
        } catch (error) {
            console.error('Error loading test history:', error);
        }
    };

    const handleSummaryChange = async (event) => {
        const summaryId = event.target.value;
        console.log('Summary changed to ID:', summaryId);
        setSelectedSummaryId(summaryId);
        setSelectedAnswer(null);
        setHasFlashcards(false);

        if (summaryId) {
            try {
                setLoading(true);
                const response = await getFlashcards(summaryId);
                console.log('Fetched flashcards:', response.data);
                setFlashcards(response.data);
                setHasFlashcards(response.data.length > 0);
                setCurrentIndex(0);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
                setError('Failed to load flashcards');
            } finally {
                setLoading(false);
            }
        } else {
            setFlashcards([]);
        }
    };

    const handleGenerateFlashcards = async () => {
        if (!selectedSummaryId) {
            setError('Please select a summary first');
            return;
        }

        try {
            setLoading(true);
            const response = await generateFlashcards(selectedSummaryId);
            setFlashcards(response.data);
            setHasFlashcards(true);
            setCurrentIndex(0);
            setSelectedAnswer(null);
            fetchSummaries();
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setError('Failed to generate flashcards');
        } finally {
            setLoading(false);
        }
    };

    const startTest = () => {
        setTestMode(true);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setTestResults([]);
        setShowResults(false);
        setUserAnswers({});
    };

    const handleAnswerSelect = (answerIndex) => {
        console.log('Selecting answer:', answerIndex, 'for question:', currentIndex);
        setSelectedAnswer(answerIndex);
        setUserAnswers(prev => {
            const newAnswers = {
                ...prev,
                [currentIndex]: answerIndex
            };
            console.log('Updated user answers:', newAnswers);
            return newAnswers;
        });
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(userAnswers[currentIndex + 1] || null);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedAnswer(userAnswers[currentIndex - 1] || null);
        }
    };

    const finishTest = async () => {
        if (Object.keys(userAnswers).length !== flashcards.length) {
            setError('Please answer all questions before finishing the test');
            return;
        }

        try {
            const questionResults = flashcards.map((flashcard, index) => ({
                question: flashcard.question,
                selectedAnswer: flashcard.answers[userAnswers[index]],
                correctAnswer: flashcard.answers[flashcard.correctAnswerIndex],
                isCorrect: userAnswers[index] === flashcard.correctAnswerIndex
            }));

            const correctAnswers = questionResults.filter(result => result.isCorrect).length;
            const score = Math.round((correctAnswers / flashcards.length) * 100);

            const requestBody = {
                results: questionResults,
                totalQuestions: flashcards.length,
                correctAnswers: correctAnswers,
                score: score
            };

            const numericSummaryId = Number(selectedSummaryId);
            console.log('Selected Summary ID:', numericSummaryId);
            console.log('Sending request body:', JSON.stringify(requestBody, null, 2));
            console.log('Request URL:', `/api/tests/${numericSummaryId}/results`);

            const response = await saveTestResult(numericSummaryId, requestBody);
            console.log('Test results saved successfully:', response.data);

            setShowResults(true);
            setTestMode(false);
            setTestResults(response.data.questionResults || questionResults);
            await loadTestHistory();
        } catch (error) {
            console.error('Error saving test results:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            setError('Failed to save test results: ' + error.message);
        }
    };

    const handleViewTest = (test) => {
        console.log('Viewing test:', test);
        const results = test.questionResults || [];
        console.log('Test results:', results);
        setTestResults(results);
        setShowResults(true);
        setTestMode(false);
    };

    const calculateScore = () => {
        if (!testResults || testResults.length === 0) return 0;
        const correctAnswers = testResults.filter(result => result.isCorrect).length;
        return Math.round((correctAnswers / testResults.length) * 100);
    };

    const resetTest = () => {
        setTestMode(false);
        setShowResults(false);
        setTestResults([]);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setUserAnswers({});
    };

    const handleDeleteFlashcards = async () => {
        if (!selectedSummaryId) return;

        try {
            setLoading(true);
            await deleteFlashcards(selectedSummaryId);
            setFlashcards([]);
            setHasFlashcards(false);
            fetchSummaries();
            setError(null);
        } catch (error) {
            console.error('Error deleting flashcards:', error);
            setError('Failed to delete flashcards');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSummary = async () => {
        if (!selectedSummaryId) return;

        try {
            setLoading(true);
            await deleteSummary(selectedSummaryId);
            setFlashcards([]);
            setSelectedSummaryId(null);
            fetchSummaries();
            setError(null);
        } catch (error) {
            console.error('Error deleting summary:', error);
            setError('Failed to delete summary');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        try {
            await deleteTest(testId);
            setTestHistory(testHistory.filter(test => test.id !== testId));
        } catch (error) {
            console.error('Error deleting test:', error);
            setError('Failed to delete test');
        }
    };

    const getFilteredTestHistory = () => {
        if (!selectedSummaryId || summaries.length === 0) {
            console.log('No summary selected or no summaries available');
            return [];
        }

        const numericSummaryId = Number(selectedSummaryId);
        const selectedSummary = summaries.find(s => Number(s.id) === numericSummaryId);

        if (!selectedSummary) {
            console.log('Selected summary not found');
            return [];
        }

        console.log('Filtering test history:', {
            testHistory,
            selectedSummaryId: numericSummaryId,
            selectedSummaryTitle: selectedSummary.originalFileName
        });

        const filteredHistory = testHistory.filter(test =>
            test.summary && test.summary.id === numericSummaryId
        );

        console.log('Filtered test history:', filteredHistory);
        return filteredHistory;
    };

    return (
        <div className="flashcard-generator">
            {!testMode && !showResults ? (
                <>
                    <div className="summary-selector">
                        <h3>Select a Summary</h3>
                        <select
                            value={selectedSummaryId || ''}
                            onChange={handleSummaryChange}
                            className="summary-dropdown"
                        >
                            <option value="">Select a summary...</option>
                            {Array.isArray(summaries) && summaries.map(summary => (
                                <option key={summary.id} value={summary.id}>
                                    {summary.originalFileName} {summary.hasFlashcards ? '(Has Flashcards)' : '(No Flashcards)'}
                                </option>
                            ))}
                        </select>

                        <div className="button-group">
                            {selectedSummaryId && (
                                <>
                                    {!hasFlashcards ? (
                                        <button
                                            onClick={handleGenerateFlashcards}
                                            disabled={loading}
                                            className="generate-button"
                                        >
                                            {loading ? 'Generating...' : 'Generate Flashcards'}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={startTest}
                                                className="test-button"
                                            >
                                                Start Test
                                            </button>
                                            <button
                                                onClick={handleGenerateFlashcards}
                                                disabled={loading}
                                                className="generate-button"
                                            >
                                                Generate New Flashcards
                                            </button>
                                            <button
                                                onClick={() => downloadFlashcards(selectedSummaryId)}
                                                style={{
                                                    padding: "10px 16px",
                                                    backgroundColor: "#2563eb",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    marginTop: "10px"
                                                }}
                                            >
                                                Download Flashcards
                                            </button>

                                        </>
                                    )}
                                    <button
                                        onClick={handleDeleteFlashcards}
                                        disabled={loading || !hasFlashcards}
                                        className="delete-button"
                                    >
                                        Delete Flashcards
                                    </button>
                                    <button
                                        onClick={handleDeleteSummary}
                                        disabled={loading}
                                        className="delete-button"
                                    >
                                        Delete Summary
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {selectedSummaryId && (
                        <TestHistory
                            testHistory={getFilteredTestHistory()}
                            onViewTest={handleViewTest}
                            onDeleteTest={handleDeleteTest}
                        />
                    )}
                </>
            ) : testMode ? (
                <div className="test-view">
                    <div className="test-header">
                        <div className="test-progress">
                            Question {currentIndex + 1} of {flashcards.length}
                            <div className="answers-progress">
                                ({Object.keys(userAnswers).length} of {flashcards.length} answered)
                            </div>
                        </div>
                        <button
                            onClick={finishTest}
                            disabled={Object.keys(userAnswers).length !== flashcards.length}
                            className="finish-test-button"
                        >
                            Finish Test
                        </button>
                    </div>

                    <div className="test-content">
                        <div className="flashcard">
                            <div className="question">{flashcards[currentIndex].question}</div>
                            <div className="answers">
                                {flashcards[currentIndex].answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`answer-button ${selectedAnswer === index ? 'selected' : ''}`}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="test-navigation">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="nav-button prev-button"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === flashcards.length - 1}
                                className="nav-button next-button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="results-container">
                    <h2>Test Results</h2>
                    <div className="score-display">
                        <div className="score-circle">
                            <span className="score-percentage">{calculateScore()}%</span>
                            <span className="score-label">Correct</span>
                        </div>
                    </div>
                    <div className="results-list">
                        {testResults.map((result, index) => (
                            <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                <h3>Question {index + 1}</h3>
                                <p className="question-text">{result.question}</p>
                                <div className="answer-details">
                                    <p><strong>Your answer:</strong> {result.selectedAnswer}</p>
                                    {!result.isCorrect && (
                                        <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={resetTest} className="reset-button">
                        Take Test Again
                    </button>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading...</div>}
        </div>
    );
};

export default FlashcardGenerator; 