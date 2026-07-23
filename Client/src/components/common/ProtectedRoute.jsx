import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E67E22]"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Debugging: check exact user role in console
  // console.log("Current User Role:", user?.role);

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    
    // Check case-insensitively AND allow common aliases like 'user'
    const hasPermission = allowedRoles.some((role) => {
      const target = role.toLowerCase();
      if (target === 'customer' && userRole === 'user') return true; // fallback alias
      return target === userRole;
    });

    if (!hasPermission) {
      console.warn(`Access denied. User role "${user.role}" not in allowed:`, allowedRoles);
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;