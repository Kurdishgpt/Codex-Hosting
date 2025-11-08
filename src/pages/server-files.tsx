import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Folder, File, Upload, FolderPlus, FileText, Trash2, X, Move } from 'lucide-react';
import ServerNav from '../components/ServerNav';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
  modified: string;
  path: string;
}

const ServerFiles = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewDirModal, setShowNewDirModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [extractOnUpload, setExtractOnUpload] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newDirName, setNewDirName] = useState('');
  const [moveDestination, setMoveDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async (path: string = '/') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/files`, {
        params: { serverId: 'default', dir: path }
      });
      setFiles(response.data.files);
      setCurrentPath(response.data.currentPath);
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) return;

    const formData = new FormData();
    Array.from(fileInputRef.current.files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('serverId', 'default');
    formData.append('dir', currentPath);
    formData.append('extract', extractOnUpload.toString());

    try {
      setLoading(true);
      await axios.post(`${API_URL}/files/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUploadModal(false);
      setExtractOnUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadFiles(currentPath);
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    try {
      setLoading(true);
      await axios.post(`${API_URL}/files/create`, {
        serverId: 'default',
        path: `${currentPath}/${newFileName}`,
        content: '',
        isDirectory: false
      });
      setShowNewFileModal(false);
      setNewFileName('');
      await loadFiles(currentPath);
      alert('File created successfully!');
    } catch (error) {
      console.error('Error creating file:', error);
      alert('Failed to create file');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDirectory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirName) return;

    try {
      setLoading(true);
      await axios.post(`${API_URL}/files/create`, {
        serverId: 'default',
        path: `${currentPath}/${newDirName}`,
        isDirectory: true
      });
      setShowNewDirModal(false);
      setNewDirName('');
      await loadFiles(currentPath);
      alert('Directory created successfully!');
    } catch (error) {
      console.error('Error creating directory:', error);
      alert('Failed to create directory');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Delete ${selectedFiles.size} item(s)?`)) return;

    try {
      setLoading(true);
      const paths = Array.from(selectedFiles);
      await axios.delete(`${API_URL}/files/delete`, {
        data: { serverId: 'default', paths }
      });
      setSelectedFiles(new Set());
      await loadFiles(currentPath);
      alert('Files deleted successfully!');
    } catch (error) {
      console.error('Error deleting files:', error);
      alert('Failed to delete files');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL files? This cannot be undone!')) return;

    try {
      setLoading(true);
      await axios.post(`${API_URL}/files/clear`, {
        serverId: 'default'
      });
      await loadFiles(currentPath);
      alert('All files cleared successfully!');
    } catch (error) {
      console.error('Error clearing files:', error);
      alert('Failed to clear files');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.size === 0 || !moveDestination) return;

    try {
      setLoading(true);
      for (const source of Array.from(selectedFiles)) {
        await axios.post(`${API_URL}/files/move`, {
          serverId: 'default',
          source,
          destination: `${moveDestination}/${source.split('/').pop()}`
        });
      }
      setShowMoveModal(false);
      setMoveDestination('');
      setSelectedFiles(new Set());
      await loadFiles(currentPath);
      alert('Files moved successfully!');
    } catch (error) {
      console.error('Error moving files:', error);
      alert('Failed to move files');
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (filePath: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(filePath)) {
      newSelection.delete(filePath);
    } else {
      newSelection.add(filePath);
    }
    setSelectedFiles(newSelection);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">File Manager</h1>
          <p className="text-gray-400">Create, edit, and manage files on your server</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex gap-2 mb-4 flex-wrap">
            <button 
              onClick={() => setShowNewDirModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <FolderPlus size={18} />
              Create Directory
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Upload size={18} />
              Upload
            </button>
            <button 
              onClick={() => setShowNewFileModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <FileText size={18} />
              New File
            </button>
            {selectedFiles.size > 0 && (
              <>
                <button 
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Trash2 size={18} />
                  Delete ({selectedFiles.size})
                </button>
                <button 
                  onClick={() => setShowMoveModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Move size={18} />
                  Move
                </button>
              </>
            )}
            <button 
              onClick={handleClearAll}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm ml-auto"
            >
              <Trash2 size={18} />
              Clear All Files
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <p className="text-sm text-gray-400">{currentPath}</p>
            </div>
            
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-400">Loading files...</div>
            ) : files.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">No files found. Upload or create files to get started.</div>
            ) : (
              <div className="divide-y divide-gray-700">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedFiles.has(file.path)}
                        onChange={() => toggleFileSelection(file.path)}
                      />
                      {file.isDirectory ? (
                        <Folder className="text-blue-400" size={20} />
                      ) : (
                        <File className="text-gray-400" size={20} />
                      )}
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {!file.isDirectory && <span className="text-gray-400 text-sm">{formatFileSize(file.size)}</span>}
                      <span className="text-gray-400 text-sm w-40">{formatDate(file.modified)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Upload Files</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleFileUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Select Files</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="extractCheckbox"
                    checked={extractOnUpload}
                    onChange={(e) => setExtractOnUpload(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="extractCheckbox" className="text-sm">
                    Extract .zip files after upload (keeps original file)
                  </label>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* New File Modal */}
        {showNewFileModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Create New File</h3>
                <button onClick={() => setShowNewFileModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateFile}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">File Name</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="example.txt"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !newFileName}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create File'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewFileModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* New Directory Modal */}
        {showNewDirModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Create Directory</h3>
                <button onClick={() => setShowNewDirModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateDirectory}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Directory Name</label>
                  <input
                    type="text"
                    value={newDirName}
                    onChange={(e) => setNewDirName(e.target.value)}
                    placeholder="my-folder"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !newDirName}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Directory'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewDirModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Move Modal */}
        {showMoveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Move Files</h3>
                <button onClick={() => setShowMoveModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleMove}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Destination Path</label>
                  <input
                    type="text"
                    value={moveDestination}
                    onChange={(e) => setMoveDestination(e.target.value)}
                    placeholder="/path/to/destination"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                  <p className="text-gray-400 text-sm mt-2">Moving {selectedFiles.size} item(s)</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !moveDestination}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Moving...' : 'Move Files'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowMoveModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ServerFiles;
