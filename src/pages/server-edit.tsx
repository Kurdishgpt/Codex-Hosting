import { motion } from 'framer-motion';
import { Cpu, Database, HardDrive, Settings } from 'lucide-react';
import { useState } from 'react';
import ServerNav from '../components/ServerNav';

const ServerEdit = () => {
  const [cpuLimit, setCpuLimit] = useState(50);
  const [memoryLimit, setMemoryLimit] = useState(512);
  const [diskLimit, setDiskLimit] = useState(1024);

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Server</h1>
          <p className="text-gray-400">Adjust your server's resources and features below.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Resource Allocation</h2>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cpu className="text-orange-400" size={24} />
                  <div>
                    <h3 className="font-bold">CPU Limit</h3>
                    <p className="text-sm text-gray-400">Available: 6%</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">{cpuLimit}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCpuLimit(Math.max(0, cpuLimit - 10))}
                  className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  -
                </button>
                <div className="flex-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={cpuLimit}
                    onChange={(e) => setCpuLimit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${cpuLimit}%, #374151 ${cpuLimit}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-orange-400">•</span>
                    <span>100%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setCpuLimit(Math.min(100, cpuLimit + 10))}
                  className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="text-blue-400" size={24} />
                  <div>
                    <h3 className="font-bold">Memory Limit</h3>
                    <p className="text-sm text-gray-400">Available: 512 MB</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">{memoryLimit} MB</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMemoryLimit(Math.max(128, memoryLimit - 128))}
                  className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  -
                </button>
                <div className="flex-1">
                  <input 
                    type="range" 
                    min="128" 
                    max="2048" 
                    step="128"
                    value={memoryLimit}
                    onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((memoryLimit - 128) / (2048 - 128)) * 100}%, #374151 ${((memoryLimit - 128) / (2048 - 128)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>128 MB</span>
                    <span>2048 MB</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMemoryLimit(Math.min(2048, memoryLimit + 128))}
                  className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="text-purple-400" size={24} />
                  <div>
                    <h3 className="font-bold">Disk Limit</h3>
                    <p className="text-sm text-gray-400">Available: 1 GB</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">{diskLimit} MB</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setDiskLimit(Math.max(256, diskLimit - 256))}
                  className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  -
                </button>
                <div className="flex-1">
                  <input 
                    type="range" 
                    min="256" 
                    max="5120" 
                    step="256"
                    value={diskLimit}
                    onChange={(e) => setDiskLimit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((diskLimit - 256) / (5120 - 256)) * 100}%, #374151 ${((diskLimit - 256) / (5120 - 256)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>256 MB</span>
                    <span className="text-purple-400">•</span>
                    <span>5120 MB</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDiskLimit(Math.min(5120, diskLimit + 256))}
                  className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Reset
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ServerEdit;
