import axios from 'axios';
import api from '../config/api';

const API_URL = 'http://localhost:8080/api/users';

export const loginUser = async (username, password) => {
    try {
        const response = await api.post(`${API_URL}/login`, { username, password });
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.email));
        return response.data;
    }
    catch (error) {
        console.log("Login error:", error);
        const message =
            error.response?.data?.message ||
            error.message ||
            "Invalid credentials";
        alert(message);
        throw error;
    }
}

export const getUsers = () => axios.get(API_URL);

export const createUser = (user) => axios.post(`${API_URL}/signup`, user);

export const addTaskForUser = (userId, task) => api.post(`${API_URL}/addTask`, task);

export const getUserTasks = () => api.get(`${API_URL}/getUserTasks`)