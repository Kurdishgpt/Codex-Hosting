import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '../config/api';

interface ServerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'runtime' | 'database';
  versions?: { value: string; label: string }[];
}

const serverTypes: ServerType[] = [
  {
    id: 'nodejs',
    name: 'NodeJS',
    description: 'A runtime for executing JavaScript server-side',
    icon: '⬢',
    category: 'runtime',
    versions: [
      { value: '20', label: 'Node.js 20 LTS (Recommended)' },
      { value: '18', label: 'Node.js 18 LTS' },
      { value: '16', label: 'Node.js 16' },
    ]
  },
  {
    id: 'bun',
    name: 'Bun',
    description: "It's the same as NodeJS but faster!",
    icon: '🥟',
    category: 'runtime',
    versions: [
      { value: 'latest', label: 'Bun Latest (Recommended)' },
      { value: '1.0', label: 'Bun 1.0' },
    ]
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Beginner-friendly, easy to understand',
    icon: '🐍',
    category: 'runtime',
    versions: [
      { value: '3.11', label: 'Python 3.11 (Recommended)' },
      { value: '3.10', label: 'Python 3.10' },
      { value: '3.9', label: 'Python 3.9' },
    ]
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Object-oriented, reliable',
    icon: '☕',
    category: 'runtime',
    versions: [
      { value: '17', label: 'Java 17 LTS (Recommended)' },
      { value: '11', label: 'Java 11 LTS' },
      { value: '8', label: 'Java 8' },
    ]
  },
  {
    id: 'csharp',
    name: 'C#',
    description: 'Modern & powerful',
    icon: '🔷',
    category: 'runtime',
    versions: [
      { value: '7.0', label: '.NET 7.0 (Recommended)' },
      { value: '6.0', label: '.NET 6.0 LTS' },
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Fearless concurrency!',
    icon: '🦀',
    category: 'runtime',
    versions: [
      { value: 'latest', label: 'Rust Latest (Recommended)' },
      { value: 'stable', label: 'Rust Stable' },
    ]
  },
  {
    id: 'lua',
    name: 'Lua',
    description: 'Lightweight scripting & extensible',
    icon: '🌙',
    category: 'runtime',
    versions: [
      { value: '5.4', label: 'Lua 5.4 (Recommended)' },
      { value: '5.3', label: 'Lua 5.3' },
    ]
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL, flexible document database',
    icon: '🍃',
    category: 'database',
    versions: [
      { value: '7.0', label: 'MongoDB 7.0 (Recommended)' },
      { value: '6.0', label: 'MongoDB 6.0' },
      { value: '5.0', label: 'MongoDB 5.0' },
    ]
  },
  {
    id: 'mariadb',
    name: 'MariaDB',
    description: 'MySQL fork & open-source',
    icon: '🐬',
    category: 'database',
    versions: [
      { value: '11', label: 'MariaDB 11 (Recommended)' },
      { value: '10.11', label: 'MariaDB 10.11 LTS' },
    ]
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory, fast key-value store',
    icon: '📮',
    category: 'database',
    versions: [
      { value: '7', label: 'Redis 7 (Recommended)' },
      { value: '6', label: 'Redis 6' },
    ]
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Open-source relational database',
    icon: '🐘',
    category: 'database',
    versions: [
      { value: '16', label: 'PostgreSQL 16 (Recommended)' },
      { value: '15', label: 'PostgreSQL 15' },
      { value: '14', label: 'PostgreSQL 14' },
    ]
  },
];

const CreateServer = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [cpu, setCpu] = useState('50%');
  const [memory, setMemory] = useState('512 MB');
  const [disk, setDisk] = useState('1 GB');
  const [location, setLocation] = useState('United States');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    // Auto-select first version for the selected type
    const type = serverTypes.find(t => t.id === typeId);
    if (type?.versions && type.versions.length > 0) {
      setSelectedVersion(type.versions[0].value);
    }
  };

  const handleNext = async () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && serverName) {
      // Create server via API
      try {
        setLoading(true);
        
        const response = await fetch(getApiUrl('/api/servers/create'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: serverName,
            runtime: selectedType,
            version: selectedVersion,
            description: serverDescription,
            cpu,
            memory,
            disk,
            location
          })
        });

        const data = await response.json();

        if (data.success) {
          // Navigate to installation screen
          navigate(`/server/installation?id=${data.server.id}&name=${encodeURIComponent(serverName)}`);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error creating server:', error);
        alert('Failed to create server. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const selectedServerType = serverTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="container mx-auto px-4 py-20 pt-32 max-w-6xl">
        
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Create New Server</h1>
            <p className="text-gray-400">
              {step === 1 ? 'Choose your server type' : 'Configure your server'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              1
            </div>
            <span className="font-semibold">Select Type</span>
          </div>
          <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              2
            </div>
            <span className="font-semibold">Configure</span>
          </div>
          <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              3
            </div>
            <span className="font-semibold">Deploy</span>
          </div>
        </div>

        {/* Step 1: Select Server Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Runtime Environments</h2>
              <p className="text-gray-400">Select a programming language or runtime</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {serverTypes.filter(t => t.category === 'runtime').map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectType(type.id)}
                  className={`bg-gray-800/50 backdrop-blur-md border rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${
                    selectedType === type.id
                      ? 'border-blue-500 ring-2 ring-blue-500/50'
                      : 'border-gray-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{type.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{type.name}</h3>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </div>
                    {selectedType === type.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Databases</h2>
              <p className="text-gray-400">Select a database system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {serverTypes.filter(t => t.category === 'database').map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (serverTypes.filter(t => t.category === 'runtime').length + index) * 0.05 }}
                  onClick={() => handleSelectType(type.id)}
                  className={`bg-gray-800/50 backdrop-blur-md border rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${
                    selectedType === type.id
                      ? 'border-green-500 ring-2 ring-green-500/50'
                      : 'border-gray-700 hover:border-green-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{type.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{type.name}</h3>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </div>
                    {selectedType === type.id && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedType}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedType
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure Server */}
        {step === 2 && selectedServerType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
                <div className="text-5xl">{selectedServerType.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedServerType.name} Server</h2>
                  <p className="text-gray-400">{selectedServerType.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Server Name *</label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="my-awesome-server"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-gray-500 text-sm mt-2">Choose a unique name for your server</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Server Description</label>
                  <textarea
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    placeholder="What's this server for?"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none h-24"
                  />
                </div>

                {selectedServerType.versions && selectedServerType.versions.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Version *</label>
                    <select 
                      value={selectedVersion}
                      onChange={(e) => setSelectedVersion(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      {selectedServerType.versions.map((version) => (
                        <option key={version.value} value={version.value}>
                          {version.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500 text-sm mt-2">Select the version for your {selectedServerType.name} server</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">CPU Allocation</label>
                    <select 
                      value={cpu}
                      onChange={(e) => setCpu(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>50% (Free)</option>
                      <option>100% (1 Credit/month)</option>
                      <option>200% (2 Credits/month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Memory</label>
                    <select 
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>512 MB (Free)</option>
                      <option>1 GB (1 Credit/month)</option>
                      <option>2 GB (2 Credits/month)</option>
                      <option>4 GB (4 Credits/month)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Disk Space</label>
                    <select 
                      value={disk}
                      onChange={(e) => setDisk(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>1 GB (Free)</option>
                      <option>5 GB (1 Credit/month)</option>
                      <option>10 GB (2 Credits/month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Server Location</label>
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>🇺🇸 United States</option>
                      <option>🇳🇱 Netherlands</option>
                      <option>🇩🇪 Germany</option>
                      <option>🇸🇬 Singapore</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Server className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-blue-200 mb-1">Free Tier Selected</h4>
                      <p className="text-sm text-blue-300">
                        You're creating a free server! You can upgrade resources anytime from the server dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!serverName || loading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  serverName && !loading
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Server size={20} />
                {loading ? 'Creating...' : 'Create Server'}
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default CreateServer;
