import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await healthCheck();
      if (response.data.status === 'healthy') {
        setStatus('healthy');
      } else {
        setStatus('unhealthy');
      }
      setLastChecked(new Date());
    } catch (error) {
      setStatus('error');
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'System Healthy';
      case 'unhealthy':
        return 'System Issues';
      case 'error':
        return 'Connection Error';
      default:
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {lastChecked && (
        <span className="text-xs text-gray-500">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkHealth}
        disabled={loading}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Refresh health status"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default HealthCheck; 