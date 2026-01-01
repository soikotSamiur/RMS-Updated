// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { auth as apiAuth } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async ({ email, password }) => {
    const res = await apiAuth.login(email, password);
    setUser(res.user);
    setIsAuthenticated(true);
    return res.user; // Return user data for immediate use
  };

  const register = async (data) => {
    const res = await apiAuth.register(data);
    setUser(res.user);
    setIsAuthenticated(true);
    return res.user; // Return user data for immediate use
  };

  const logout = async () => {
    await apiAuth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
