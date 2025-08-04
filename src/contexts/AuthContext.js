import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// RBAC Permission Matrix
const PERMISSIONS = {
  admin: {
    canCreateUsers: true,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: true,
    canAccessAllData: true,
    canManageUsers: true,
  },
  manager: {
    canCreateUsers: false,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: true,
    canAccessAllData: true,
    canManageUsers: false,
  },
  user: {
    canCreateUsers: false,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: false,
    canAccessAllData: false,
    canManageUsers: false,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (userData) => {
    setUser(userData);
  };

  // RBAC Helper Functions
  const getUserRole = () => {
    return user?.role || 'user';
  };

  const hasPermission = (permission) => {
    const role = getUserRole();
    return PERMISSIONS[role]?.[permission] || false;
  };

  const hasRole = (role) => {
    return getUserRole() === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(getUserRole());
  };

  const canCreateUsers = () => hasPermission('canCreateUsers');
  const canCreateProjects = () => hasPermission('canCreateProjects');
  const canCreateMilestones = () => hasPermission('canCreateMilestones');
  const canCreateTasks = () => hasPermission('canCreateTasks');
  const canAssignUsers = () => hasPermission('canAssignUsers');
  const canAccessAllData = () => hasPermission('canAccessAllData');
  const canManageUsers = () => hasPermission('canManageUsers');

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    // RBAC functions
    getUserRole,
    hasPermission,
    hasRole,
    hasAnyRole,
    canCreateUsers,
    canCreateProjects,
    canCreateMilestones,
    canCreateTasks,
    canAssignUsers,
    canAccessAllData,
    canManageUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 