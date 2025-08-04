import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  projectsAPI, 
  milestonesAPI, 
  tasksAPI, 
  commentsAPI, 
  attachmentsAPI 
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ConditionalRender } from '../components/RoleGuard';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import MilestoneCreateForm from '../components/MilestoneCreateForm';
import TaskCreateForm from '../components/TaskCreateForm';
import CommentSection from '../components/CommentSection';
import AttachmentUploader from '../components/AttachmentUploader';
import TimeLogForm from '../components/TimeLogForm';
import ProjectMemberManagement from '../components/ProjectMemberManagement';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canCreateMilestones, canCreateTasks, canAssignUsers } = useAuth();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectStats, setProjectStats] = useState({
    progress: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      console.log('Fetching project data for ID:', id);
      
      // Fetch project data first
      const projectRes = await projectsAPI.getById(id);
      setProject(projectRes.data);
      console.log('Project data loaded:', projectRes.data);
      
      // Fetch other data in parallel
      const [milestonesRes, tasksRes, progressRes, hoursRes] = await Promise.allSettled([
        milestonesAPI.getAll(),
        tasksAPI.getAll(),
        projectsAPI.getProgress(id),
        projectsAPI.getTotalHours(id)
      ]);
      
      // Handle milestones
      if (milestonesRes.status === 'fulfilled') {
        const projectMilestones = milestonesRes.value.data.filter(m => m.project === parseInt(id));
        setMilestones(projectMilestones);
        console.log('Milestones loaded:', projectMilestones);
      } else {
        console.error('Failed to load milestones:', milestonesRes.reason);
        setMilestones([]);
      }
      
      // Handle tasks
      if (tasksRes.status === 'fulfilled') {
        const allTasks = tasksRes.value.data;
        const projectMilestones = milestonesRes.status === 'fulfilled' ? milestonesRes.value.data.filter(m => m.project === parseInt(id)) : [];
        const projectTasks = allTasks.filter(t => {
          return projectMilestones.some(m => m.id === t.milestone);
        });
        setTasks(projectTasks);
        console.log('Tasks loaded:', projectTasks);
      } else {
        console.error('Failed to load tasks:', tasksRes.reason);
        setTasks([]);
      }
      
      // Handle progress
      if (progressRes.status === 'fulfilled') {
        setProjectStats(prev => ({
          ...prev,
          progress: progressRes.value.data.progress_percent || 0
        }));
        console.log('Progress loaded:', progressRes.value.data);
      } else {
        console.error('Failed to load progress:', progressRes.reason);
      }
      
      // Handle hours
      if (hoursRes.status === 'fulfilled') {
        setProjectStats(prev => ({
          ...prev,
          totalHours: hoursRes.value.data.total_hours || 0
        }));
        console.log('Hours loaded:', hoursRes.value.data);
      } else {
        console.error('Failed to load hours:', hoursRes.reason);
      }
      
    } catch (error) {
      console.error('Project data fetch error:', error);
      toast.error(`Failed to load project data: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneCreated = (newMilestone) => {
    setMilestones([...milestones, newMilestone]);
    setShowMilestoneForm(false);
    toast.success('Milestone created successfully!');
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    toast.success('Task created successfully!');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
        <p className="text-gray-600 mt-2">The project you're looking for doesn't exist.</p>
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
            onClick={() => navigate('/projects')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary inline-flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Timeline</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
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
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-lg font-bold text-gray-900">
                {projectStats.progress}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-lg font-bold text-gray-900">
                {projectStats.totalHours}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-lg font-bold text-gray-900">{project.member_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks</p>
              <p className="text-lg font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {project.progress_percent || 0}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${project.progress_percent || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: FileText },
            { id: 'members', name: 'Members', icon: Users },
            { id: 'milestones', name: 'Milestones', icon: Calendar },
            { id: 'tasks', name: 'Tasks', icon: CheckCircle },
            { id: 'comments', name: 'Comments', icon: MessageSquare },
            { id: 'attachments', name: 'Files', icon: Paperclip },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="text-gray-900">{formatDate(project.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <p className="text-gray-900">{formatDate(project.end_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-gray-900">{project.total_hours || 0} hours</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-gray-900">{project.progress_percent || 0}%</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getStatusColor(task.status)}
                    `}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <ProjectMemberManagement projectId={parseInt(id)} />
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
              <ConditionalRender condition={canCreateMilestones()}>
                <button
                  onClick={() => setShowMilestoneForm(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </button>
              </ConditionalRender>
            </div>

            {milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">Due: {formatDate(milestone.due_date)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/milestones/${milestone.id}`)}
                          className="p-2 text-gray-400 hover:text-primary-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No milestones yet. Create your first milestone!</p>
              </div>
            )}

            {showMilestoneForm && (
              <MilestoneCreateForm
                projectId={parseInt(id)}
                onCreated={handleMilestoneCreated}
                onCancel={() => setShowMilestoneForm(false)}
              />
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
              <ConditionalRender condition={canCreateTasks()}>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </ConditionalRender>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
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
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tasks yet. Create your first task!</p>
              </div>
            )}

            {showTaskForm && (
              <TaskCreateForm
                milestones={milestones}
                projectId={parseInt(id)}
                onCreated={handleTaskCreated}
                onCancel={() => setShowTaskForm(false)}
              />
            )}

            {showTimeLogForm && selectedTask && (
              <TimeLogForm
                task={selectedTask}
                onTimeLogged={handleTimeLogged}
                onCancel={() => {
                  setShowTimeLogForm(false);
                  setSelectedTask(null);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <CommentSection projectId={parseInt(id)} />
        )}

        {activeTab === 'attachments' && (
          <AttachmentUploader projectId={parseInt(id)} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage; 