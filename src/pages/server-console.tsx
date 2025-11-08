import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Server, Wifi, Cpu, Database, HardDrive, Clock, PlayCircle, RotateCcw, StopCircle, Terminal, X, Save } from 'lucide-react';
import ServerNav from '../components/ServerNav';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { API_URL, SOCKET_URL, getApiUrl } from '../config/api';

interface ConsoleLog {
  type: 'stdout' | 'stderr' | 'info' | 'clear';
  message?: string;
  timestamp?: Date;
  logs?: ConsoleLog[];
}

interface ServerConfig {
  name: string;
  command: string;
  runtime: string;
}

const ServerConsole = () => {
  const [consoleOutput, setConsoleOutput] = useState<ConsoleLog[]>([]);
  const [serverStatus, setServerStatus] = useState<'running' | 'stopped'>('stopped');
  const [commandInput, setCommandInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uptime, setUptime] = useState('0h 0m 0s');
  const [cpuUsage] = useState(0.19);
  const [memoryUsage] = useState({ used: 107.96, total: 512 });
  const [diskUsage] = useState({ used: 347.28, total: 1024 });
  const [serverConfig, setServerConfig] = useState<ServerConfig>({
    name: 'My Server',
    command: 'node index.js',
    runtime: 'nodejs'
  });
  const [serverId, setServerId] = useState<string>('default');
  const consoleRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    // Get server ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'default';
    setServerId(id);

    // Load server data from API
    if (id !== 'default') {
      fetch(getApiUrl(`/api/servers/${id}`))
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setServerConfig({
              name: data.server.name,
              command: data.server.command,
              runtime: data.server.runtime
            });
          }
        })
        .catch(error => console.error('Error loading server:', error));
    } else {
      // For default server, check localStorage
      const saved = localStorage.getItem('serverConfig');
      if (saved) {
        setServerConfig(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to console server');
      socketRef.current?.emit('subscribe', serverId);
    });

    socketRef.current.on(`console:${serverId}`, (data: any) => {
      if (data.type === 'clear') {
        setConsoleOutput([]);
      } else if (data.type === 'history' && data.logs) {
        setConsoleOutput(data.logs);
      } else if (data.message) {
        setConsoleOutput(prev => [...prev, data]);
      }
    });

    // Load initial status
    loadServerStatus();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      if (serverStatus === 'running' && startTimeRef.current) {
        const now = new Date();
        const diff = now.getTime() - startTimeRef.current.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setUptime(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setUptime('0h 0m 0s');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  const loadServerStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/server/status`, {
        params: { serverId }
      });
      setServerStatus(response.data.status);
      if (response.data.logs) {
        setConsoleOutput(response.data.logs);
      }
      if (response.data.status === 'running' && !startTimeRef.current) {
        startTimeRef.current = new Date();
      }
    } catch (error) {
      console.error('Error loading server status:', error);
    }
  };

  const handleSaveServer = () => {
    localStorage.setItem('serverConfig', JSON.stringify(serverConfig));
    alert('Server configuration saved successfully!');
  };

  const handleStartServer = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/server/start`, {
        serverId,
        command: serverConfig.command,
        runtime: serverConfig.runtime
      });
      setServerStatus('running');
      startTimeRef.current = new Date();
      alert('Server started successfully!');
    } catch (error: any) {
      console.error('Error starting server:', error);
      alert(error.response?.data?.error || 'Failed to start server');
    } finally {
      setLoading(false);
    }
  };

  const handleStopServer = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/server/stop`, {
        serverId
      });
      setServerStatus('stopped');
      startTimeRef.current = null;
      alert('Server stopped successfully!');
    } catch (error: any) {
      console.error('Error stopping server:', error);
      alert(error.response?.data?.error || 'Failed to stop server');
    } finally {
      setLoading(false);
    }
  };

  const handleRestartServer = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/server/restart`, {
        serverId,
        command: serverConfig.command,
        runtime: serverConfig.runtime
      });
      setServerStatus('running');
      startTimeRef.current = new Date();
      alert('Server restarted successfully!');
    } catch (error: any) {
      console.error('Error restarting server:', error);
      alert(error.response?.data?.error || 'Failed to restart server');
    } finally {
      setLoading(false);
    }
  };

  const handleClearConsole = async () => {
    try {
      await axios.post(`${API_URL}/console/clear`, {
        serverId
      });
      setConsoleOutput([]);
    } catch (error) {
      console.error('Error clearing console:', error);
    }
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    try {
      await axios.post(`${API_URL}/console/command`, {
        serverId,
        command: commandInput
      });
      setCommandInput('');
    } catch (error: any) {
      console.error('Error sending command:', error);
      alert(error.response?.data?.error || 'Failed to send command');
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{serverConfig.name}</h1>
          <p className="text-gray-400">CodeX Hosting - Real 24/7 Server Management</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              serverStatus === 'running' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${serverStatus === 'running' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
              {serverStatus === 'running' ? 'Running' : 'Stopped'}
            </span>
            <span className="text-sm text-gray-500">Command: {serverConfig.command}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button 
            onClick={handleStartServer}
            disabled={loading || serverStatus === 'running'}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle size={18} />
            Start
          </button>
          <button 
            onClick={handleRestartServer}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw size={18} />
            Restart
          </button>
          <button 
            onClick={handleStopServer}
            disabled={loading || serverStatus === 'stopped'}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <StopCircle size={18} />
            Stop
          </button>
          <button 
            onClick={handleClearConsole}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <X size={18} />
            Clear Console
          </button>
          <button 
            onClick={handleSaveServer}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            Save Server
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Terminal size={24} className="text-green-400" />
                Live Console
              </h2>
              <span className="text-sm text-gray-400">{consoleOutput.length} lines</span>
            </div>
            <div 
              ref={consoleRef}
              className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm"
            >
              {consoleOutput.length === 0 ? (
                <p className="text-gray-500">No console output yet. Start your server to see logs.</p>
              ) : (
                consoleOutput.map((log, index) => (
                  <p key={index} className={`${
                    log.type === 'stdout' ? 'text-gray-300' :
                    log.type === 'stderr' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {log.message}
                  </p>
                ))
              )}
            </div>
            
            {/* Command Input */}
            <form onSubmit={handleSendCommand} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Enter command..."
                  disabled={serverStatus !== 'running'}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={serverStatus !== 'running'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-blue-400" size={24} />
                <div>
                  <h3 className="font-bold">Uptime</h3>
                  <p className="text-2xl font-bold text-white">{uptime}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="text-blue-400" size={24} />
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-lg text-white">localhost:3001</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-blue-400" size={24} />
                <div className="w-full">
                  <h3 className="font-bold mb-2">CPU</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${cpuUsage}%` }}></div>
                    </div>
                    <span className="text-white">{cpuUsage.toFixed(2)}% / 50%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-blue-400" size={24} />
                <div className="w-full">
                  <h3 className="font-bold mb-2">Memory</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(memoryUsage.used / memoryUsage.total) * 100}%` }}></div>
                    </div>
                    <span className="text-white">{memoryUsage.used.toFixed(2)} MiB / {memoryUsage.total} MiB</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="text-blue-400" size={24} />
                <div className="w-full">
                  <h3 className="font-bold mb-2">Disk</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(diskUsage.used / diskUsage.total) * 100}%` }}></div>
                    </div>
                    <span className="text-white">{diskUsage.used.toFixed(2)} MiB / {(diskUsage.total / 1024).toFixed(1)} GiB</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-blue-400" size={24} />
                <div>
                  <h3 className="font-bold">Server Plan</h3>
                  <p className="text-lg text-green-400">Free Forever</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServerConsole;
