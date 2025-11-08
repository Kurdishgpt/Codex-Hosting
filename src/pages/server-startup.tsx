import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Terminal, Save, AlertCircle } from 'lucide-react';
import ServerNav from '../components/ServerNav';
import axios from 'axios';
import { API_URL } from '../config/api';

interface ServerData {
  id: string;
  name: string;
  runtime: string;
  command: string;
  version: string;
}

const ServerStartup = () => {
  const [serverId, setServerId] = useState<string>('default');
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [startupCommand, setStartupCommand] = useState('node index.js');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Get server ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'default';
    setServerId(id);
  }, []);

  useEffect(() => {
    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  const loadServerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/servers/${serverId}`);
      if (response.data.success) {
        setServerData(response.data.server);
        setStartupCommand(response.data.server.command || 'node index.js');
      }
    } catch (error) {
      console.error('Error loading server data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommand = async () => {
    if (!startupCommand.trim()) {
      alert('Please enter a valid startup command');
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${API_URL}/servers/${serverId}`, {
        command: startupCommand.trim()
      });
      alert('✅ Startup command saved successfully! Restart your server for changes to take effect.');
    } catch (error) {
      console.error('Error saving startup command:', error);
      alert('Failed to save startup command. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDefaultCommand = () => {
    if (!serverData) return 'node index.js';
    
    switch (serverData.runtime) {
      case 'nodejs':
      case 'bun':
        return 'node index.js';
      case 'python':
        return 'python main.py';
      case 'java':
        return 'java Main';
      case 'csharp':
        return 'dotnet run';
      case 'rust':
        return 'cargo run';
      case 'lua':
        return 'lua main.lua';
      default:
        return 'node index.js';
    }
  };

  const runtimeExamples = {
    'nodejs': [
      'node index.js',
      'npm start',
      'node src/bot.js',
      'node --max-old-space-size=512 index.js'
    ],
    'python': [
      'python main.py',
      'python3 bot.py',
      'python -u main.py',
      'python src/app.py'
    ],
    'bun': [
      'bun index.js',
      'bun run start',
      'bun run dev'
    ],
    'java': [
      'java Main',
      'java -jar app.jar',
      'java -Xmx512m Main'
    ]
  };

  const examples = serverData ? (runtimeExamples[serverData.runtime as keyof typeof runtimeExamples] || runtimeExamples['nodejs']) : runtimeExamples['nodejs'];

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Startup Settings</h1>
          <p className="text-gray-400">Configure your server's startup command</p>
        </div>

        {loading ? (
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-12 text-center">
            <p className="text-gray-400">Loading server data...</p>
          </div>
        ) : (
          <>
            {/* Server Info */}
            {serverData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-900/20 backdrop-blur-md border border-blue-700 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-200 mb-1">Server: {serverData.name}</h4>
                  <p className="text-sm text-blue-300">
                    Runtime: {serverData.runtime} {serverData.version} • Current command: {serverData.command}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Startup Command */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold">Startup Command</h2>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Command</label>
                <input
                  type="text"
                  value={startupCommand}
                  onChange={(e) => setStartupCommand(e.target.value)}
                  placeholder={getDefaultCommand()}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
                <p className="text-gray-400 text-sm mt-2">
                  This command will be executed when your server starts. Make sure the file exists in your server directory.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-300">Common Examples for {serverData?.runtime || 'Node.js'}:</h3>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setStartupCommand(example)}
                      className="block w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-mono text-gray-300 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveCommand}
                disabled={saving || !startupCommand.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Startup Command'}
              </button>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-900/20 backdrop-blur-md border border-yellow-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-3 text-yellow-200">Important Notes</h3>
              <ul className="space-y-2 text-sm text-yellow-100">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>After changing the startup command, you need to <strong>restart your server</strong> for the changes to take effect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Make sure the file you're trying to run exists in your server's file directory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>For Discord bots, make sure to add your bot token in Settings → Environment Variables before starting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>If your bot requires dependencies (npm packages, pip packages, etc.), install them via the Files section or upload a package.json/requirements.txt file.</span>
                </li>
              </ul>
            </motion.div>
          </>
        )}

      </div>
    </div>
  );
};

export default ServerStartup;
