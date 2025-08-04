import React, { useState, useEffect } from 'react';
import { attachmentsAPI } from '../services/api';
import { Paperclip, Upload, Download, Trash2, File, Image, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AttachmentUploader = ({ projectId }) => {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchAttachments();
  }, [projectId]);

  const fetchAttachments = async () => {
    try {
      const response = await attachmentsAPI.getAll();
      // Filter attachments for this project (you might need to adjust this based on your API)
      setAttachments(response.data);
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('task', null); // You might want to associate with a specific task

      const response = await attachmentsAPI.create(formData);
      setAttachments([...attachments, response.data]);
      setSelectedFile(null);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await attachmentsAPI.delete(attachmentId);
        setAttachments(attachments.filter(attachment => attachment.id !== attachmentId));
        toast.success('File deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete file');
        console.error('Delete error:', error);
      }
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return <Image className="h-6 w-6 text-blue-500" />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FileText className="h-6 w-6 text-blue-600" />;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <FileText className="h-6 w-6 text-green-600" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Paperclip className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
      </div>

      {/* Upload Section */}
      <div className="card">
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              <label
                htmlFor="file-upload"
                className="btn-secondary inline-flex items-center cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </span>
              )}
            </div>
            {selectedFile && (
              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary inline-flex items-center"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Maximum file size: 10MB. Supported formats: All file types.
          </p>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        {attachments.length > 0 ? (
          attachments.map((attachment) => (
            <div key={attachment.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(attachment.file)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {attachment.file.split('/').pop()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDate(attachment.uploaded_at || new Date())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={attachment.file}
                    download
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(attachment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attachments yet. Upload your first file!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentUploader; 