import React, { useState } from 'react';
import { milestonesAPI } from '../services/api';
import { Calendar, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MilestoneCreateForm = ({ projectId, onCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);

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
      toast.error('Milestone title is required');
      return;
    }
    
    if (!formData.due_date) {
      toast.error('Due date is required');
      return;
    }

    setLoading(true);
    
    try {
      const response = await milestonesAPI.create({
        ...formData,
        project: projectId
      });
      onCreated(response.data);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create milestone';
      toast.error(message);
      console.error('Create milestone error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Milestone</h3>
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
            Milestone Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter milestone title"
            required
          />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
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
              required
            />
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
            Create Milestone
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneCreateForm; 