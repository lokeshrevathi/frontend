import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send, Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentSection = ({ projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getAll();
      // Filter comments for this project (you might need to adjust this based on your API)
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    
    try {
      const response = await commentsAPI.create({
        content: newComment,
        task: null, // You might want to associate with a specific task
        user: user.id,
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Add comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await commentsAPI.update(commentId, { content: editText });
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editText }
          : comment
      ));
      setEditingComment(null);
      setEditText('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      toast.error('Failed to update comment');
      console.error('Update comment error:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.delete(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete comment');
        console.error('Delete comment error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
      </div>

      {/* Add Comment Form */}
      <div className="card">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Share your thoughts..."
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary inline-flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="card">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {comment.user?.first_name?.[0] || comment.user?.username?.[0] || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user?.first_name} {comment.user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </p>
                    </div>
                    {user?.id === comment.user?.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditText(comment.content);
                          }}
                          className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Edit comment"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="mt-3 space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="input-field resize-none"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="btn-primary text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 