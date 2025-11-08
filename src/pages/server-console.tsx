import { motion } from 'framer-motion';
import { Server, Wifi, Cpu, Database, HardDrive, Clock, PlayCircle, RotateCcw, StopCircle, Trash2 } from 'lucide-react';
import ServerNav from '../components/ServerNav';

const ServerConsole = () => {

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">wednesday's server</h1>
          <p className="text-gray-400">Orihost.com, best free 24/7 hosting service</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlayCircle size={18} />
            Start
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <RotateCcw size={18} />
            Restart
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <StopCircle size={18} />
            Stop
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Trash2 size={18} />
            Destroy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Console</h2>
            <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              <p className="text-green-400">run 'npm fast' for details</p>
              <p className="text-gray-400">--&gt; node server.js</p>
              <p className="text-gray-400">To make sure server is known, run</p>
              <p className="text-gray-400">'npm audit fix --force'</p>
              <p className="text-gray-400">Up to date, audited 341 packages in 3s</p>
              <p className="text-gray-400">Run 'npm audit' for details.</p>
              <p className="text-gray-400">Up to date, audited 341 packages in 3s</p>
              <p className="text-green-400">✓ pm run fast for details.</p>
              <p className="text-gray-400">✓ wedneday-server's vulnerabilities</p>
              <p className="text-gray-400">Up to date, audited 341 packages in 3s</p>
              <p className="text-gray-400">found 0 vulnerabilities</p>
              <p className="text-green-400">&gt; wedneday-server's vulnerabilities</p>
              <p className="text-gray-400">To address all issues (including breaking changes), run</p>
              <p className="text-gray-400">'npm audit fix --force'</p>
              <p className="text-gray-400">Up to date, audited 341 packages in 3s</p>
              <p className="text-gray-400">found 0 vulnerabilities</p>
            </div>
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
                  <p className="text-2xl font-bold text-white">14h 24m 5s</p>
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
                  <p className="text-lg text-white">176.100.37.91:30069</p>
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
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0.19%' }}></div>
                    </div>
                    <span className="text-white">0.19% / 50%</span>
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
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                    </div>
                    <span className="text-white">107.96 MiB / 512 MiB</span>
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
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                    <span className="text-white">347.28 MiB / 1 GiB</span>
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
                  <h3 className="font-bold">Server Expires</h3>
                  <p className="text-lg text-white">in 20 days / Renewal Disabled</p>
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
