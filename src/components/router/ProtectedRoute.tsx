import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, isLoading }) => {
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
