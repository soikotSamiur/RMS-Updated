// src/services/axios.js
import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
});

// Request queue to prevent too many simultaneous requests
let pendingRequests = 0;
const MAX_CONCURRENT_REQUESTS = 6;
const requestQueue = [];

const processQueue = () => {
  while (pendingRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
    const { config, resolve } = requestQueue.shift();
    pendingRequests++;
    resolve(config);
  }
};

// Automatically attach token from localStorage if it exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Queue management
  return new Promise((resolve) => {
    if (pendingRequests >= MAX_CONCURRENT_REQUESTS) {
      requestQueue.push({ config, resolve });
    } else {
      pendingRequests++;
      resolve(config);
    }
  });
}, error => Promise.reject(error));

// Response interceptor to handle rate limiting and queue
API.interceptors.response.use(
  (response) => {
    pendingRequests--;
    processQueue();
    return response;
  },
  (error) => {
    pendingRequests--;
    processQueue();
    
    // Handle 429 errors with retry logic
    if (error.response?.status === 429) {
      const config = error.config;
      
      // Prevent infinite retry loops
      if (!config.__retryCount) {
        config.__retryCount = 0;
      }
      
      if (config.__retryCount < 3) {
        config.__retryCount++;
        
        // Exponential backoff: wait longer on each retry
        const delay = 1000 * Math.pow(2, config.__retryCount);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(API(config));
          }, delay);
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
