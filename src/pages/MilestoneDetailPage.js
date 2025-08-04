import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { milestonesAPI, tasksAPI, projectsAPI } from '../services/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCreateForm from '../components/TaskCreateForm';

const MilestoneDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    due_date: ''
  });

  useEffect(() => {
    fetchMilestoneData();
  }, [id, fetchMilestoneData]);

  const fetchMilestoneData = useCallback(async () => {
    try {
      const [milestoneRes, tasksRes] = await Promise.all([
        milestonesAPI.getById(id),
        tasksAPI.getAll()
      ]);

      const milestoneData = milestoneRes.data;
      setMilestone(milestoneData);
      setEditData({
        title: milestoneData.title,
        due_date: milestoneData.due_date
      });

      // Get project details
      const projectRes = await projectsAPI.getById(milestoneData.project);
      setProject(projectRes.data);

      // Filter tasks for this milestone
      const milestoneTasks = tasksRes.data.filter(t => t.milestone === parseInt(id));
      setTasks(milestoneTasks);
    } catch (error) {
      toast.error('Failed to load milestone data');
      console.error('Milestone data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      await milestonesAPI.update(id, editData);
      setMilestone({ ...milestone, ...editData });
      setEditing(false);
      toast.success('Milestone updated successfully!');
    } catch (error) {
      toast.error('Failed to update milestone');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this milestone? This will also delete all associated tasks.')) {
      try {
        await milestonesAPI.delete(id);
        toast.success('Milestone deleted successfully!');
        navigate(`/projects/${milestone.project}`);
      } catch (error) {
        toast.error('Failed to delete milestone');
        console.error('Delete error:', error);
      }
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    toast.success('Task created successfully!');
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

  const isOverdue = () => {
    if (!milestone) return false;
    const today = new Date();
    const dueDate = new Date(milestone.due_date);
    return dueDate < today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Milestone not found</h2>
        <p className="text-gray-600 mt-2">The milestone you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/projects')}
          className="btn-primary mt-4"
        >
          Back to Projects
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
            onClick={() => navigate(`/projects/${milestone.project}`)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{milestone.title}</h1>
            <p className="text-gray-600">
              Project: {project?.name}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          {editing ? (
            <>
              <button 
                onClick={handleUpdate}
                className="btn-primary"
              >
                Save
              </button>
              <button 
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setEditing(true)}
                className="btn-secondary inline-flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="btn-danger inline-flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Milestone Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Due Date</p>
              <p className={`text-lg font-bold ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(milestone.due_date)}
                {isOverdue() && <AlertCircle className="h-4 w-4 inline ml-2" />}
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
              <p className="text-sm font-medium text-gray-600">Tasks</p>
              <p className="text-lg font-bold text-gray-900">{tasks.length}</p>
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
                {tasks.reduce((sum, task) => sum + (task.logged_hours || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Milestone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={editData.due_date}
                onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
                  <div className="flex space-x-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </div>
        )}

        {showTaskForm && (
          <TaskCreateForm
            milestoneId={parseInt(id)}
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MilestoneDetailPage; 