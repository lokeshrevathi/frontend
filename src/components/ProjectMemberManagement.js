import React, { useState, useEffect, useCallback } from 'react';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ConditionalRender } from './RoleGuard';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectMemberManagement = ({ projectId }) => {
  const { canAssignUsers } = useAuth();
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchAvailableUsers();
  }, [projectId, fetchMembers, fetchAvailableUsers]);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await projectsAPI.getMembers(projectId);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch project members:', error);
      toast.error('Failed to load project members');
    }
  }, [projectId]);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const response = await projectsAPI.getAvailableUsers(projectId);
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch available users:', error);
      toast.error('Failed to load available users');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user to add');
      return;
    }

    setAddingMember(true);
    try {
      await projectsAPI.addMember(projectId, parseInt(selectedUserId));
      toast.success('User added to project successfully!');
      setSelectedUserId('');
      // Refresh both lists
      await Promise.all([fetchMembers(), fetchAvailableUsers()]);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to add user to project';
      toast.error(message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectsAPI.removeMember(projectId, userId);
      toast.success('User removed from project successfully!');
      // Refresh both lists
      await Promise.all([fetchMembers(), fetchAvailableUsers()]);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to remove user from project';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader className="h-6 w-6 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Project Members
        </h3>
        <span className="text-sm text-gray-500">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add Member Section */}
      <ConditionalRender condition={canAssignUsers()}>
        <div className="card">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </h4>
          
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="input-field w-full"
                disabled={addingMember}
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.username})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddMember}
              disabled={!selectedUserId || addingMember}
              className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingMember ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Add Member
            </button>
          </div>

          {/* Available Users Info */}
          {availableUsers.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    No users available to add to this project.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Users must have 'user' role and not exceed 2 project limit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ConditionalRender>

      {/* Current Members */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 mb-4">Current Members</h4>
        
        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {member.user?.first_name} {member.user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.user?.username} • Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <ConditionalRender condition={canAssignUsers()}>
                  <button
                    onClick={() => handleRemoveMember(member.user?.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove from project"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </ConditionalRender>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No members yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              {canAssignUsers() 
                ? "Add users to collaborate on this project."
                : "Only admins and managers can add project members."
              }
            </p>
          </div>
        )}
      </div>

      {/* Constraints Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Project Member Constraints
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Only users with 'user' role can be added to projects</li>
                <li>Maximum 2 projects per user</li>
                <li>Project owner cannot be added as a member</li>
                <li>Users already in the project cannot be added again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMemberManagement; 