import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'hook/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 16 }}>로딩 중...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default ProtectedRoute;


