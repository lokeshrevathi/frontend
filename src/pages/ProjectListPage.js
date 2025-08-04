import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ConditionalRender } from '../components/RoleGuard';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectListPage = () => {
  const { canCreateProjects, canAccessAllData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Projects fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Delete project error:', error);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'active') {
      const today = new Date();
      const endDate = new Date(project.end_date);
      matchesFilter = endDate >= today;
    } else if (filterStatus === 'completed') {
      matchesFilter = project.progress_percent === 100;
    } else if (filterStatus === 'overdue') {
      const today = new Date();
      const endDate = new Date(project.end_date);
      matchesFilter = endDate < today && project.progress_percent < 100;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (progress) => {
    if (progress === 100) return 'bg-green-100 text-green-800';
    if (progress >= 70) return 'bg-blue-100 text-blue-800';
    if (progress >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            {canAccessAllData() 
              ? 'Manage and track all projects' 
              : 'View your assigned projects and tasks'
            }
          </p>
        </div>
        <ConditionalRender condition={canCreateProjects()}>
          <Link
            to="/projects/create"
            className="btn-primary inline-flex items-center mt-4 sm:mt-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </Link>
        </ConditionalRender>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="View Project"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {project.progress_percent || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress_percent || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Start: {formatDate(project.start_date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>End: {formatDate(project.end_date)}</span>
                </div>
                {project.total_hours > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{project.total_hours} hours logged</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${getStatusColor(project.progress_percent || 0)}
                `}>
                  {project.progress_percent === 100 ? 'Completed' : 
                   project.progress_percent >= 70 ? 'In Progress' :
                   project.progress_percent >= 40 ? 'Started' : 'Not Started'}
                </span>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new project.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-6">
              <Link
                to="/projects/create"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Project
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage; 