import React, { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ConditionalRender } from '../components/RoleGuard';
import { Calendar, Save, X, User, AlertTriangle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskCreateForm = ({ milestones, projectId, onCreated, onCancel }) => {
  const { canAssignUsers } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestone: '',
    assignee: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
  });
  const [loading, setLoading] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (projectId && canAssignUsers()) {
      fetchProjectMembers();
    }
  }, [projectId]);

  const fetchProjectMembers = async () => {
    setLoadingMembers(true);
    try {
      // Get project members (current members)
      const membersResponse = await projectsAPI.getMembers(projectId);
      setProjectMembers(membersResponse.data);
      
      // Get available users (can be added to project)
      const availableResponse = await projectsAPI.getAvailableUsers(projectId);
      setAvailableUsers(availableResponse.data);
    } catch (error) {
      console.error('Failed to fetch project members:', error);
      toast.error('Failed to load project members');
    } finally {
      setLoadingMembers(false);
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
    
    if (!formData.milestone) {
      toast.error('Please select a milestone');
      return;
    }

    setLoading(true);
    
    try {
      const response = await tasksAPI.create({
        ...formData,
        milestone: parseInt(formData.milestone),
        assignee: formData.assignee ? parseInt(formData.assignee) : null,
      });
      onCreated(response.data);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create task';
      toast.error(message);
      console.error('Create task error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            rows={3}
            className="input-field resize-none"
            placeholder="Describe the task..."
          />
        </div>

        <div>
          <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-2">
            Milestone *
          </label>
          <select
            id="milestone"
            name="milestone"
            value={formData.milestone}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select a milestone</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.title}
              </option>
            ))}
          </select>
        </div>

        <ConditionalRender condition={canAssignUsers()}>
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="input-field pl-10"
                disabled={loadingMembers}
              >
                <option value="">Select assignee (optional)</option>
                {loadingMembers ? (
                  <option value="" disabled>Loading members...</option>
                ) : (
                  <>
                    {/* Project Members */}
                    {projectMembers.length > 0 && (
                      <optgroup label="Project Members">
                        {projectMembers.map((member) => (
                          <option key={member.user.id} value={member.user.id}>
                            {member.user.first_name} {member.user.last_name} ({member.user.username})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    
                    {/* Available Users (can be added to project) */}
                    {availableUsers.length > 0 && (
                      <optgroup label="Available Users">
                        {availableUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.last_name} ({user.username}) - Not in project
                          </option>
                        ))}
                      </optgroup>
                    )}
                    
                    {projectMembers.length === 0 && availableUsers.length === 0 && (
                      <option value="" disabled>No users available for assignment</option>
                    )}
                  </>
                )}
              </select>
              {loadingMembers && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Tasks can be assigned to project members or available users
            </p>
          </div>
        </ConditionalRender>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
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
              <Save className="h-4 w-4 mr-2" />
            )}
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreateForm; 