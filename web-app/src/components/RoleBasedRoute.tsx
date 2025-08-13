import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'customer') {
    return <Navigate to="/customers" replace />;
  } else if (user.role === 'business_owner') {
    return <Navigate to="/business" replace />;
  }

  // If user has no role set, redirect to login
  return <Navigate to="/login" replace />;
};

export default RoleBasedRoute;