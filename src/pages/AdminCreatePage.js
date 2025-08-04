import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Crown, Shield, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCreatePage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (adminSecret === 'admin123') { // Simple secret for demo
      setIsAuthenticated(true);
      toast.success('Admin authentication successful');
    } else {
      toast.error('Invalid admin secret');
      setAdminSecret('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // For public admin creation page, use the public registration endpoint
      // but only allow admin role creation
      if (formData.role !== 'admin') {
        toast.error('This page only allows admin user creation. Use the main registration page for other roles.');
        return;
      }
      
      await authAPI.register(formData);
      toast.success('Admin user created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the admin secret to create privileged users
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSecretSubmit}>
            <div>
              <label htmlFor="adminSecret" className="sr-only">
                Admin Secret
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="adminSecret"
                  name="adminSecret"
                  type="password"
                  required
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter admin secret"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Authenticate
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Back to regular registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <Crown className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Privileged User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create admin, manager, or user accounts
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter email"
                />
              </div>
            </div>

                         <div>
               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                 Role
               </label>
               <div className="mt-1 relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Crown className="h-5 w-5 text-gray-400" />
                 </div>
                 <select
                   id="role"
                   name="role"
                   value={formData.role}
                   onChange={handleChange}
                   className="input-field pl-10"
                   disabled
                 >
                   <option value="admin">Admin</option>
                 </select>
               </div>
               <p className="mt-1 text-xs text-gray-500">
                 This page only allows admin user creation
               </p>
             </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password2"
                  name="password2"
                  type={showPassword2 ? 'text' : 'password'}
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

                     {/* Admin Creation Info */}
           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
             <div className="flex">
               <div className="flex-shrink-0">
                 <AlertTriangle className="h-5 w-5 text-green-400" />
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-green-800">
                   Admin User Creation
                 </h3>
                 <div className="mt-2 text-sm text-green-700">
                   <p>
                     This page allows public creation of admin users. Use the main registration page for creating users with other roles.
                   </p>
                 </div>
               </div>
             </div>
           </div>

          {/* Role Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Role Permissions
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Admin:</strong> Full system access, user management</li>
                    <li><strong>Manager:</strong> Project management, task assignment</li>
                    <li><strong>User:</strong> Basic access, assigned tasks only</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                `Create ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} User`
              )}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <Link
            to="/register"
            className="block font-medium text-primary-600 hover:text-primary-500"
          >
            Back to regular registration
          </Link>
          <Link
            to="/login"
            className="block font-medium text-primary-600 hover:text-primary-500"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePage; 