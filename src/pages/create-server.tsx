import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ArrowLeft } from 'lucide-react';

interface ServerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'runtime' | 'database';
}

const serverTypes: ServerType[] = [
  {
    id: 'nodejs',
    name: 'NodeJS',
    description: 'A runtime for executing JavaScript server-side',
    icon: '⬢',
    category: 'runtime'
  },
  {
    id: 'bun',
    name: 'Bun',
    description: "It's the same as NodeJS but faster!",
    icon: '🥟',
    category: 'runtime'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Beginner-friendly, easy to understand',
    icon: '🐍',
    category: 'runtime'
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Object-oriented, reliable',
    icon: '☕',
    category: 'runtime'
  },
  {
    id: 'csharp',
    name: 'C#',
    description: 'Modern & powerful',
    icon: '🔷',
    category: 'runtime'
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Fearless concurrency!',
    icon: '🦀',
    category: 'runtime'
  },
  {
    id: 'lua',
    name: 'Lua',
    description: 'Lightweight scripting & extensible',
    icon: '🌙',
    category: 'runtime'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL, flexible document database',
    icon: '🍃',
    category: 'database'
  },
  {
    id: 'mariadb',
    name: 'MariaDB',
    description: 'MySQL fork & open-source',
    icon: '🐬',
    category: 'database'
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory, fast key-value store',
    icon: '📮',
    category: 'database'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Open-source relational database',
    icon: '🐘',
    category: 'database'
  },
];

const CreateServer = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [serverName, setServerName] = useState('');
  const [step, setStep] = useState(1);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && serverName) {
      // Create server and redirect to console
      navigate('/server/console');
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
                    placeholder="What's this server for?"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">CPU Allocation</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
                      <option>50% (Free)</option>
                      <option>100% (1 Credit/month)</option>
                      <option>200% (2 Credits/month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Memory</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
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
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
                      <option>1 GB (Free)</option>
                      <option>5 GB (1 Credit/month)</option>
                      <option>10 GB (2 Credits/month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Server Location</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
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
                disabled={!serverName}
                className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  serverName
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Server size={20} />
                Create Server
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default CreateServer;
