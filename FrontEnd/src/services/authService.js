// src/services/authService.js
import API from './axios';

// Authentication API
const authService = {
  // Register a new user
  register: async (data) => {
    const res = await API.post('/register', data);
    // Optionally store token/user here automatically
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data; // { user, token, message }
  },

  // Login user
  login: async (email, password) => {
    const res = await API.post('/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  // Logout user
  logout: async () => {
    await API.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Send OTP to email
  sendOTP: async (email) => {
    const res = await API.post('/password/send-otp', { email });
    return res.data;
  },

  // Reset password with OTP
  resetPassword: async (email, otp, password) => {
    const res = await API.post('/password/reset', { email, otp, password });
    return res.data;
  }
};

export default authService;
