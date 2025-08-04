import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

// RoleGuard component for protecting routes
export const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { hasAnyRole, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// PermissionGuard component for protecting specific features
export const PermissionGuard = ({ children, permission, fallback = null }) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return fallback;
    }
    
    return null; // Don't render anything if no permission
  }

  return children;
};

// ConditionalRender component for showing/hiding UI elements
export const ConditionalRender = ({ children, condition, fallback = null }) => {
  if (!condition) {
    return fallback;
  }

  return children;
};

// Hook for easy role checking in components
export const useRoleGuard = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    // Convenience methods
    isAdmin: () => auth.hasRole('admin'),
    isManager: () => auth.hasRole('manager'),
    isUser: () => auth.hasRole('user'),
    isAdminOrManager: () => auth.hasAnyRole(['admin', 'manager']),
  };
}; 