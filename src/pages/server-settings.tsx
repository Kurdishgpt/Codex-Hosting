import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Server, Trash2, Image, Edit3, RotateCcw, AlertTriangle, Key, Plus, X, Edit } from 'lucide-react';
import ServerNav from '../components/ServerNav';
import axios from 'axios';
import { API_URL } from '../config/api';

interface EnvVariable {
  key: string;
  value: string;
}

const ServerSettings = () => {
  const [serverId, setServerId] = useState<string>('default');
  const [envVars, setEnvVars] = useState<EnvVariable[]>([]);
  const [showAddEnvModal, setShowAddEnvModal] = useState(false);
  const [showEditEnvModal, setShowEditEnvModal] = useState(false);
  const [editingEnv, setEditingEnv] = useState<EnvVariable | null>(null);
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get server ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'default';
    setServerId(id);
  }, []);

  useEffect(() => {
    if (serverId) {
      loadEnvironmentVariables();
    }
  }, [serverId]);

  const loadEnvironmentVariables = async () => {
    try {
      const response = await axios.get(`${API_URL}/env`, {
        params: { serverId }
      });
      const variables = Object.entries(response.data.variables).map(([key, value]) => ({
        key,
        value: value as string
      }));
      setEnvVars(variables);
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  };

  const handleAddEnvVariable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvKey || !newEnvValue) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/env/set`, {
        serverId,
        key: newEnvKey,
        value: newEnvValue
      });
      setShowAddEnvModal(false);
      setNewEnvKey('');
      setNewEnvValue('');
      await loadEnvironmentVariables();
      
      if (response.data.autoStarted) {
        alert('✅ Environment variable added and server automatically started with your bot token!');
      } else {
        alert('Environment variable added successfully!');
      }
    } catch (error) {
      console.error('Error adding environment variable:', error);
      alert('Failed to add environment variable');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEnvVariable = (envVar: EnvVariable) => {
    setEditingEnv(envVar);
    setNewEnvKey(envVar.key);
    setNewEnvValue(envVar.value);
    setShowEditEnvModal(true);
  };

  const handleUpdateEnvVariable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvKey || !newEnvValue || !editingEnv) return;

    try {
      setLoading(true);
      // Delete old key if it changed
      if (newEnvKey !== editingEnv.key) {
        await axios.delete(`${API_URL}/env/delete`, {
          data: { serverId, key: editingEnv.key }
        });
      }
      // Set new/updated value
      const response = await axios.post(`${API_URL}/env/set`, {
        serverId,
        key: newEnvKey,
        value: newEnvValue
      });
      setShowEditEnvModal(false);
      setEditingEnv(null);
      setNewEnvKey('');
      setNewEnvValue('');
      await loadEnvironmentVariables();
      
      if (response.data.autoStarted) {
        alert('✅ Environment variable updated and server automatically restarted with your bot token!');
      } else {
        alert('Environment variable updated successfully!');
      }
    } catch (error) {
      console.error('Error updating environment variable:', error);
      alert('Failed to update environment variable');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnvVariable = async (key: string) => {
    if (!confirm(`Delete environment variable "${key}"?`)) return;

    try {
      await axios.delete(`${API_URL}/env/delete`, {
        data: { serverId, key }
      });
      await loadEnvironmentVariables();
      alert('Environment variable deleted successfully!');
    } catch (error) {
      console.error('Error deleting environment variable:', error);
      alert('Failed to delete environment variable');
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Server Settings</h1>
          <p className="text-gray-400">Configure and manage your server settings</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Server className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Server Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-sm">Node</p>
              <p className="text-white font-semibold">DE-01</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Server ID</p>
              <p className="text-white font-mono text-sm">bcb2eb5b-7e18-4aff-a792-8b455eec23a</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-900/20 backdrop-blur-md border border-red-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="text-red-400" size={24} />
            <h2 className="text-xl font-bold">Delete Server</h2>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
            <p className="text-sm text-yellow-200">
              <strong>Danger:</strong> This action cannot be undone. All data will be permanently lost.
            </p>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Deleting your server will shut down all processes, return resources to your account, and delete all files, backups, databases, and settings associated with this server.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Delete Server
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key className="text-green-400" size={24} />
              <h2 className="text-xl font-bold">Environment Variables</h2>
            </div>
            <button 
              onClick={() => setShowAddEnvModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              Add Variable
            </button>
          </div>
          
          {envVars.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <p className="text-gray-400">No environment variables set. Add one to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {envVars.map((envVar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm text-green-400 font-semibold">{envVar.key}</p>
                    <p className="font-mono text-sm text-gray-400 mt-1 break-all">{envVar.value}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => handleEditEnvVariable(envVar)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteEnvVariable(envVar.key)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold">Change Server Background</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Background Image URL</p>
          <input 
            type="text" 
            defaultValue="http://example.com/image.jpg"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-4"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Save Background
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Edit3 className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Change Server Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Server Name</label>
              <input 
                type="text" 
                defaultValue="wednesday's server"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Server Description</label>
              <textarea 
                defaultValue="Orihost.com, best free 24/7 hosting service."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-24"
              />
            </div>
          </div>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Save Changes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-900/20 backdrop-blur-md border border-yellow-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold">Reinstall Server</h2>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
            <p className="text-sm text-yellow-200">
              <strong>Warning:</strong> This will stop your server and may delete or modify files. Back up your data before continuing.
            </p>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Reinstalling your server will stop it and re-run the initial installation script. Some files may be modified or deleted during this process.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Reinstall Server
          </button>
        </motion.div>

        {/* Add Environment Variable Modal */}
        {showAddEnvModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Add Environment Variable</h3>
                <button onClick={() => setShowAddEnvModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddEnvVariable}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Variable Name</label>
                  <input
                    type="text"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder="API_KEY"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Value</label>
                  <textarea
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="your-secret-value"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono h-24"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !newEnvKey || !newEnvValue}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Variable'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddEnvModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Environment Variable Modal */}
        {showEditEnvModal && editingEnv && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Edit Environment Variable</h3>
                <button onClick={() => {
                  setShowEditEnvModal(false);
                  setEditingEnv(null);
                  setNewEnvKey('');
                  setNewEnvValue('');
                }} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateEnvVariable}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Variable Name</label>
                  <input
                    type="text"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder="API_KEY"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Value</label>
                  <textarea
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="your-secret-value"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono h-24"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !newEnvKey || !newEnvValue}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Variable'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEditEnvModal(false);
                      setEditingEnv(null);
                      setNewEnvKey('');
                      setNewEnvValue('');
                    }}
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

export default ServerSettings;
