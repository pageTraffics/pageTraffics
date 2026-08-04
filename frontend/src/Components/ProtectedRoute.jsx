import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { currentUser, userData, isAdmin } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (userData && !isAdmin) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        color: '#0f172a'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#dc2626', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>You do not have Administrator permissions to access the Admin Dashboard.</p>
        <a href="/" style={{
          padding: '12px 24px',
          background: '#FF6900',
          color: 'white',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '700'
        }}>Back to Home</a>
      </div>
    );
  }

  return children;
};
