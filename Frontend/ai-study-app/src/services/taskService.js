import api from '../config/api'

const API_URL = 'http://localhost:8080/api/tasks';

export const toggleTaskStatus = (taskId) => api.get(`${API_URL}/toggleIsDone/${taskId}`)

export const deleteTask = (userId, taskId) => api.delete(`${API_URL}/deleteTask/${taskId}`)