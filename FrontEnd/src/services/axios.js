// src/services/axios.js
import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
});

// Automatically attach token from localStorage if it exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default API;
