import api from '../config/api';

// Summary endpoints
export const getSummaries = () => api.get('/api/summarize/summaries');
export const deleteSummary = (summaryId) => api.delete(`/api/summarize/summaries/${summaryId}`);

// Flashcard endpoints
export const getFlashcards = (summaryId) => api.get(`/api/flashcards/summary/${summaryId}`);
export const generateFlashcards = (summaryId) => api.post(`/api/flashcards/generate/${summaryId}`);
export const deleteFlashcards = (summaryId) => api.delete(`/api/flashcards/summary/${summaryId}`);

// Test endpoints
export const getTestHistory = (summaryId) => api.get(`/api/tests/history/${summaryId}`);
export const saveTestResult = (summaryId, testResult) => {
    console.log('Saving test result with data:', JSON.stringify(testResult, null, 2));
    return api.post(`/api/tests/${summaryId}/results`, testResult);
};
export const deleteTest = (testId) => api.delete(`/api/tests/${testId}`); 