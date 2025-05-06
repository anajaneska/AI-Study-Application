import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

export const toggleTaskStatus = (taskId) => axios.get(`${API_URL}/toggleIsDone/${taskId}`)

export const deleteTask = (userId, taskId) => axios.delete(`${API_URL}/deleteTask/${userId}/${taskId}`)