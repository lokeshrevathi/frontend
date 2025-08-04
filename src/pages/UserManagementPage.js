import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { RoleGuard, ConditionalRender } from '../components/RoleGuard';
import { 
  Users, 
  UserPlus, 
  Shield, 
  User, 
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const { canCreateUsers } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.createUser(formData);
      toast.success('User created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        role: 'user'
      });
      setShowCreateForm(false);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create user';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'manager':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };



  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Create and manage user accounts</p>
          </div>
          <ConditionalRender condition={canCreateUsers()}>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </button>
          </ConditionalRender>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pr-10"
                      required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      className="input-field pr-10"
                      required
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Create User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Role Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center mb-4">
              {getRoleIcon('admin')}
              <h3 className="text-lg font-semibold text-gray-900 ml-2">Admin</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Create and manage users</li>
              <li>• Access all project data</li>
              <li>• Full system control</li>
              <li>• Assign user roles</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              {getRoleIcon('manager')}
              <h3 className="text-lg font-semibold text-gray-900 ml-2">Manager</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Create projects and tasks</li>
              <li>• Assign users to tasks</li>
              <li>• Access all project data</li>
              <li>• Manage project workflow</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              {getRoleIcon('user')}
              <h3 className="text-lg font-semibold text-gray-900 ml-2">User</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View assigned tasks</li>
              <li>• Log time on tasks</li>
              <li>• Create comments</li>
              <li>• Upload attachments</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <Users className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                User Management Instructions
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Only admins can create new users and assign roles</li>
                <li>• Managers can create projects and assign users to tasks</li>
                <li>• Regular users can only access their assigned tasks</li>
                <li>• All users can create projects, but access is role-based</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserManagementPage; 