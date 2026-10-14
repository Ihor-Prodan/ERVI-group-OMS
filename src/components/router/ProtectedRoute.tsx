import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, isLoading, mustChangePassword }) => {
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/ervi-group" replace />;
  if (mustChangePassword) return <Navigate to="/change-password" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
