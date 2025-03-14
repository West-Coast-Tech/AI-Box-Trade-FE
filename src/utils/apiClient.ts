// src/utils/apiClient.ts
import axios from 'axios';
import isTokenExpired from '../utils/tokenUtils'; // Import the token utility function
import { store } from '../redux/store';
import { refreshToken } from '../redux/actions/authActions';
const SERVER_IP = import.meta.env.VITE_SERVER_IP || 'localhost';
const httpProtocol = import.meta.env.VITE_HTTP_PROTOCOL || 'http';
const API = axios.create({
    baseURL: `${httpProtocol}://${SERVER_IP}`, // Your API base URL
});

// Request interceptor to check token expiry before sending requests
API.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            await store.dispatch(refreshToken());
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default API;
