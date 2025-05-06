import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getUsers = () => axios.get(API_URL);

export const createUser = (user) => axios.post(API_URL, user);

export const addTaskForUser = (userId, task) => axios.post(`${API_URL}/${userId}/addTask`, task);

export const getUserTasks = (userId) => axios.get(`${API_URL}/getUserTasks/${userId}`)

export const toggleTaskStatus = (taskId) => axios.get(`${API_URL}/toggleIsDone/${taskId}`)