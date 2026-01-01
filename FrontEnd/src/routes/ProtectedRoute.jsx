import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // 1️⃣ Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Redirect if user role is not allowed
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // Optionally, you can create a NotAuthorizedPage instead of redirecting to dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3️⃣ User is authenticated and role is allowed
  return children;
};

export default ProtectedRoute;
