import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const loginUser = async (credentials) => {
    const response = await axios.post('${API_URL}/login', credentials);
    const user = response.data;

    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

export const getUsers = () => axios.get(API_URL);

export const createUser = (user) => axios.post(API_URL, user);

export const addTaskForUser = (userId, task) => axios.post(`${API_URL}/${userId}/addTask`, task);

export const getUserTasks = (userId) => axios.get(`${API_URL}/getUserTasks/${userId}`)