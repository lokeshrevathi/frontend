import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend-z5zf.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = () => api.get('/health/');

// Authentication
export const authAPI = {
  register: (userData) => api.post('/api/register/', userData),
  login: (credentials) => api.post('/api/login/', credentials),
  getProfile: () => api.get('/api/me/'),
  createUser: (userData) => api.post('/api/users/create/', userData),
};

// Projects
export const projectsAPI = {
  getAll: () => api.get('/api/projects/'),
  getById: (id) => api.get(`/api/projects/${id}/`),
  create: (projectData) => api.post('/api/projects/', projectData),
  update: (id, projectData) => api.put(`/api/projects/${id}/`, projectData),
  delete: (id) => api.delete(`/api/projects/${id}/`),
  getTotalHours: (id) => api.get(`/api/projects/${id}/total_hours/`),
  getProgress: (id) => api.get(`/api/projects/${id}/progress/`),
  // Project Member Management
  getMembers: (projectId) => api.get(`/api/projects/${projectId}/members/`),
  addMember: (projectId, userId) => api.post(`/api/projects/${projectId}/members/`, { user_id: userId }),
  removeMember: (projectId, userId) => api.delete(`/api/projects/${projectId}/members/${userId}/`),
  getAvailableUsers: (projectId) => api.get(`/api/projects/${projectId}/available-users/`),
};

// Milestones
export const milestonesAPI = {
  getAll: () => api.get('/api/milestones/'),
  getById: (id) => api.get(`/api/milestones/${id}/`),
  create: (milestoneData) => api.post('/api/milestones/', milestoneData),
  update: (id, milestoneData) => api.put(`/api/milestones/${id}/`, milestoneData),
  delete: (id) => api.delete(`/api/milestones/${id}/`),
};

// Tasks
export const tasksAPI = {
  getAll: () => api.get('/api/tasks/'),
  getById: (id) => api.get(`/api/tasks/${id}/`),
  create: (taskData) => api.post('/api/tasks/', taskData),
  update: (id, taskData) => api.put(`/api/tasks/${id}/`, taskData),
  delete: (id) => api.delete(`/api/tasks/${id}/`),
  logTime: (id, hours) => api.post(`/api/tasks/${id}/log_time/`, { hours }),
  getUserTasks: () => api.get('/api/user/tasks/'),
};

// Comments
export const commentsAPI = {
  getAll: () => api.get('/api/comments/'),
  getById: (id) => api.get(`/api/comments/${id}/`),
  create: (commentData) => api.post('/api/comments/', commentData),
  update: (id, commentData) => api.put(`/api/comments/${id}/`, commentData),
  delete: (id) => api.delete(`/api/comments/${id}/`),
};

// Attachments
export const attachmentsAPI = {
  getAll: () => api.get('/api/attachments/'),
  getById: (id) => api.get(`/api/attachments/${id}/`),
  create: (formData) => api.post('/api/attachments/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/api/attachments/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/api/attachments/${id}/`),
};

export default api; 