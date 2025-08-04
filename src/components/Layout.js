import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HealthCheck from './HealthCheck';

import { 
  Home, 
  FolderOpen, 
  Plus, 
  User, 
  Menu, 
  X,
  LogOut,
  Users,
  CheckSquare
} from 'lucide-react';

const Layout = () => {
  const { user, logout, canCreateUsers, canCreateProjects } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    ...(canCreateProjects() ? [{ name: 'Create Project', href: '/projects/create', icon: Plus }] : []),
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    ...(canCreateUsers() ? [{ name: 'User Management', href: '/users', icon: Users }] : []),
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-xl font-semibold text-white">Project Manager</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive(item.href)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="px-4 py-3">
              <div className="text-xs text-gray-400 mb-2">System Status</div>
              <HealthCheck />
            </div>
          </div>

          {/* User section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    Role: {user?.role || 'user'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Project Manager</h1>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 