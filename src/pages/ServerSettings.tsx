import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Server, Package, Save, Copy, RotateCcw, X, Plus } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api';

// Available Node.js versions
const nodeVersions = [
  { id: 'nodejs-24', name: 'nodejs 24', image: 'nodejs:24' },
  { id: 'nodejs-23', name: 'nodejs 23', image: 'nodejs:23' },
  { id: 'nodejs-22', name: 'nodejs 22', image: 'nodejs:22' },
  { id: 'nodejs-21', name: 'nodejs 21', image: 'nodejs:21' },
  { id: 'nodejs-20', name: 'nodejs 20', image: 'nodejs:20' },
  { id: 'nodejs-19', name: 'nodejs 19', image: 'nodejs:19' },
  { id: 'nodejs-18', name: 'nodejs 18', image: 'nodejs:18' },
  { id: 'nodejs-16', name: 'nodejs 16', image: 'nodejs:16' },
];

const defaultStartupCommand = `node index.js`;

export default function ServerSettings() {
  const { serverId: routeServerId } = useParams();
  const serverId = routeServerId || 'test-server'; // Fallback to test-server
  const navigate = useNavigate();
  
  const [server, setServer] = useState<any>(null);
  const [startupCommand, setStartupCommand] = useState('');
  const [selectedRuntime, setSelectedRuntime] = useState('nodejs-18');
  const [packages, setPackages] = useState<string[]>([]);
  const [newPackage, setNewPackage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    loadServerData();
  }, [serverId]);

  const loadServerData = async () => {
    try {
      setLoading(true);
      const [serverRes, packagesRes] = await Promise.all([
        axios.get(`${API_URL}/api/servers/${serverId}`),
        axios.get(`${API_URL}/api/packages?serverId=${serverId}`)
      ]);
      
      setServer(serverRes.data.server);
      setStartupCommand(serverRes.data.server.command || 'node index.js');
      setSelectedRuntime(serverRes.data.server.runtime || 'nodejs-18');
      setPackages(packagesRes.data.packages || []);
    } catch (error) {
      console.error('Error loading server data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommand = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_URL}/api/servers/${serverId}`, {
        command: startupCommand,
        runtime: selectedRuntime
      });
      alert('Startup command saved successfully!');
    } catch (error: any) {
      alert('Error saving command: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(startupCommand);
    alert('Command copied to clipboard!');
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default startup command?')) {
      setStartupCommand(defaultStartupCommand);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.trim()) return;
    
    try {
      await axios.post(`${API_URL}/api/packages/add`, {
        serverId,
        packageName: newPackage.trim()
      });
      setPackages([...packages, newPackage.trim()]);
      setNewPackage('');
    } catch (error: any) {
      alert('Error adding package: ' + error.message);
    }
  };

  const handleRemovePackage = async (pkg: string) => {
    try {
      await axios.delete(`${API_URL}/api/packages/remove`, {
        data: { serverId, packageName: pkg }
      });
      setPackages(packages.filter(p => p !== pkg));
    } catch (error: any) {
      alert('Error removing package: ' + error.message);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Remove all packages?')) return;
    
    try {
      await axios.post(`${API_URL}/api/packages/clear`, { serverId });
      setPackages([]);
    } catch (error: any) {
      alert('Error clearing packages: ' + error.message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPackage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a18] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-400 hover:text-blue-300 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" />
            Server Configuration - {server?.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Startup Command Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Startup Command</h2>
              <p className="text-sm text-gray-400">Configure the command that runs when your server starts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">💻 Command Editor</label>
                <span className="text-xs text-gray-500">{startupCommand.length} / 8000 chars</span>
              </div>
              <textarea
                value={startupCommand}
                onChange={(e) => setStartupCommand(e.target.value)}
                className="w-full h-32 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-blue-500"
                placeholder="Enter your startup command..."
                maxLength={8000}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="rounded" />
                Changes apply on next restart
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="rounded" />
                Ctrl+S to save
              </label>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2 transition">
                No Wrap
              </button>
              <button 
                onClick={handleCopyCommand}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button 
                onClick={handleResetToDefault}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
              <button 
                onClick={handleSaveCommand}
                disabled={saving}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Command'}
              </button>
            </div>
          </div>
        </div>

        {/* Docker Image / Runtime Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Runtime Version</h2>
              <p className="text-sm text-gray-400">Choose the Node.js version for your server environment</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">🔧 Runtime Selector</label>
              <span className="text-xs text-green-400">Ready</span>
            </div>

            {/* Currently Selected */}
            <div 
              onClick={() => setShowImageSelector(!showImageSelector)}
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/20 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <div className="font-medium">{nodeVersions.find(v => v.id === selectedRuntime)?.name || 'nodejs 18'}</div>
                  <div className="text-xs text-gray-400">{nodeVersions.find(v => v.id === selectedRuntime)?.image || 'nodejs:18'}</div>
                </div>
              </div>
              <span className="text-xs bg-blue-500/20 px-3 py-1 rounded-full text-blue-300">Currently Selected</span>
            </div>

            {showImageSelector && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="🔍 Search Docker images..."
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nodeVersions.map((version) => (
                    <div
                      key={version.id}
                      onClick={() => {
                        setSelectedRuntime(version.id);
                        setShowImageSelector(false);
                      }}
                      className={`bg-white/5 border ${selectedRuntime === version.id ? 'border-blue-500' : 'border-white/10'} rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition`}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        N
                      </div>
                      <div>
                        <div className="font-medium">{version.name}</div>
                        <div className="text-xs text-gray-400">{version.image}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 text-center">
                  💡 Click on any Docker image to select it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Package Manager Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Additional Node.js Packages</h2>
              <p className="text-sm text-gray-400">Add packages to be automatically installed with your server</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">📦 Package Manager</label>
              <span className="text-xs text-gray-500">{packages.length} packages</span>
            </div>

            {/* Add Package Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPackage}
                onChange={(e) => setNewPackage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., express, discord.js, axios"
                className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddPackage}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            </div>

            {/* Installed Packages */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Installed Packages</h3>
                {packages.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear All
                    </button>
                    <button
                      onClick={handleSaveCommand}
                      className="text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save Packages
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-black/30 border border-white/10 rounded-lg p-4 min-h-[120px]">
                {packages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No packages added yet, Add some packages to get started!</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {packages.map((pkg) => (
                      <div
                        key={pkg}
                        className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 flex items-center gap-2 group hover:bg-blue-500/30 transition"
                      >
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{pkg}</span>
                        <button
                          onClick={() => handleRemovePackage(pkg)}
                          className="opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>📦 Packages installed with npm</span>
                <span>⌨️ Press Enter to add package</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
