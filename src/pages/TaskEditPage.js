import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksAPI, milestonesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  AlertTriangle,
  User,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const TaskEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestone: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
  });

  useEffect(() => {
    fetchTaskData();
  }, [id]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      
      // Fetch task details
      const taskResponse = await tasksAPI.getById(id);
      const taskData = taskResponse.data;
      
      // Verify user has access to this task
      if (taskData.assignee !== user?.id) {
        toast.error('You can only edit tasks assigned to you');
        navigate('/my-tasks');
        return;
      }
      
      setTask(taskData);
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        milestone: taskData.milestone || '',
        due_date: taskData.due_date || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
      });
      
      // Fetch milestones for the project
      const milestonesResponse = await milestonesAPI.getAll();
      const projectMilestones = milestonesResponse.data.filter(m => m.project === taskData.project);
      setMilestones(projectMilestones);
      
    } catch (error) {
      console.error('Failed to fetch task data:', error);
      toast.error('Failed to load task details');
      navigate('/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSaving(true);
    
    try {
      const response = await tasksAPI.update(id, {
        ...formData,
        milestone: parseInt(formData.milestone),
      });
      
      toast.success('Task updated successfully!');
      navigate('/my-tasks');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update task';
      toast.error(message);
      console.error('Update task error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Task not found</h2>
        <p className="text-gray-600 mt-2">The task you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/my-tasks')}
          className="btn-primary mt-4"
        >
          Back to My Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/my-tasks')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
            <p className="text-gray-600">Update your task details and progress</p>
          </div>
        </div>
      </div>

      {/* Task Info Card */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600">Task ID: {task.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Project:</span>
            <span className="ml-2 text-gray-900">{task.project_name || 'Unknown Project'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Assignee:</span>
            <span className="ml-2 text-gray-900">{user?.first_name} {user?.last_name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Logged Hours:</span>
            <span className="ml-2 text-gray-900">{task.logged_hours || 0}h</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-2">
                Milestone
              </label>
              <select
                id="milestone"
                name="milestone"
                value={formData.milestone}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/my-tasks')}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary inline-flex items-center"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditPage; 