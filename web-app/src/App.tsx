import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import BusinessDashboard from './components/dashboards/BusinessDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root route - redirects based on auth status and role */}
          <Route path="/" element={<RoleBasedRoute />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected customer routes */}
          <Route 
            path="/customers/*" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected business routes */}
          <Route 
            path="/business/*" 
            element={
              <ProtectedRoute requiredRole="business_owner">
                <BusinessDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
