import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  User,
  FileText,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import TimeLogForm from '../components/TimeLogForm';

const UserTasksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's assigned tasks
      const tasksResponse = await tasksAPI.getUserTasks();
      setTasks(tasksResponse.data);
      
      // Fetch projects where user is a member
      const projectsResponse = await projectsAPI.getAll();
      setProjects(projectsResponse.data);
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeLogged = async (taskId, hours) => {
    try {
      await tasksAPI.logTime(taskId, hours);
      // Update the task with new logged hours
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, logged_hours: (task.logged_hours || 0) + hours }
          : task
      ));
      setShowTimeLogForm(false);
      setSelectedTask(null);
      toast.success('Time logged successfully!');
    } catch (error) {
      toast.error('Failed to log time');
      console.error('Time log error:', error);
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Task update error:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Task delete error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tasks based on status, project, and search term
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesProject = filterProject === 'all' || task.project === parseInt(filterProject);
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesProject && matchesSearch;
  });

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600">Manage your assigned tasks and track progress</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Welcome, {user?.first_name} {user?.last_name}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-lg font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Play className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-lg font-bold text-gray-900">
                {tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg font-bold text-gray-900">
                {tasks.filter(t => t.status === 'done').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-lg font-bold text-gray-900">
                {tasks.reduce((total, task) => total + (parseFloat(task.logged_hours) || 0), 0).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="input-field"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getStatusColor(task.status)}
                    `}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.priority && (
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getPriorityColor(task.priority)}
                      `}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {getProjectName(task.project)}
                    </span>
                    {task.logged_hours > 0 && (
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.logged_hours}h logged
                      </span>
                    )}
                    {task.due_date && (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {/* Log Time */}
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTimeLogForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600"
                    title="Log Time"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                  
                  {/* Update Status */}
                  <button
                    onClick={() => handleTaskStatusUpdate(task.id, 
                      task.status === 'todo' ? 'in_progress' : 
                      task.status === 'in_progress' ? 'done' : 'todo'
                    )}
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="Update Status"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  
                  {/* Edit Task */}
                  <button
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-primary-600"
                    title="Edit Task"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  {/* Delete Task */}
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FileText className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterProject !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'You don\'t have any assigned tasks yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Time Log Form Modal */}
      {showTimeLogForm && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <TimeLogForm
              task={selectedTask}
              onTimeLogged={handleTimeLogged}
              onCancel={() => {
                setShowTimeLogForm(false);
                setSelectedTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTasksPage; 