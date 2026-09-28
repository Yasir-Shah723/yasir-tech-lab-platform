import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Retrieve token and user data from storage
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('jwt');

  const userString =
    localStorage.getItem('user') ||
    localStorage.getItem('adminUser');

  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Failed to parse stored user data:', error);
  }

  // If there is no token, bounce to login and preserve target location
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Allow access to children (e.g. AdminLayout -> Dashboard)
  return children;
};

export default ProtectedRoute;