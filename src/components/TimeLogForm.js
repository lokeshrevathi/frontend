import React, { useState } from 'react';
import { Clock, Save, X } from 'lucide-react';

const TimeLogForm = ({ task, onTimeLogged, onCancel }) => {
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hoursNum = parseFloat(hours);
    if (!hoursNum || hoursNum <= 0) {
      alert('Please enter a valid number of hours');
      return;
    }

    setLoading(true);
    await onTimeLogged(task.id, hoursNum);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Log Time</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Task:</p>
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.logged_hours > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Total hours logged: {task.logged_hours}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
              Hours to Log *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="input-field pl-10"
                placeholder="0.5"
                step="0.25"
                min="0.25"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter hours in decimal format (e.g., 1.5 for 1 hour 30 minutes)
            </p>
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
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeLogForm; 