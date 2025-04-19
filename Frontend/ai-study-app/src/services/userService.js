import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; // Adjust if needed

export const getUsers = () => axios.get(API_URL);

export const createUser = (user) => axios.post(API_URL, user);
