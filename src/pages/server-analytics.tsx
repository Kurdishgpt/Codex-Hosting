import { motion } from 'framer-motion';
import { Server, Cpu, Database, HardDrive, CheckCircle } from 'lucide-react';
import ServerNav from '../components/ServerNav';

const ServerAnalytics = () => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Server Performance Analytics</h1>
          <p className="text-gray-400">Monitor resource usage and server performance metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center"
          >
            <Server className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold mb-1">Server is running</h3>
            <p className="text-sm text-gray-400">14h 24m 52s</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center"
          >
            <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-bold mb-1">CPU usage is N/A</h3>
            <p className="text-sm text-gray-400">Using 0.3%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center"
          >
            <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold mb-1">RAM usage is low</h3>
            <p className="text-sm text-gray-400">Using 21.03%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center"
          >
            <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold mb-1">Disk usage is normal</h3>
            <p className="text-sm text-gray-400">Using 33.91%</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Disk</h3>
            <div className="h-32 bg-gray-900 rounded-lg flex items-end p-4">
              <div className="w-full h-12 bg-gradient-to-t from-green-500 to-transparent rounded-t"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Memory</h3>
            <div className="h-32 bg-gray-900 rounded-lg flex items-end p-4">
              <div className="w-full h-16 bg-gradient-to-t from-green-500 to-transparent rounded-t"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Network In</h3>
            <div className="h-32 bg-gray-900 rounded-lg flex items-end p-4">
              <div className="w-full h-20 bg-gradient-to-t from-green-500 to-transparent rounded-t"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold mb-4">Network Out</h3>
            <div className="h-32 bg-gray-900 rounded-lg flex items-end p-4">
              <div className="w-full h-20 bg-gradient-to-t from-green-500 to-transparent rounded-t"></div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="text-green-400" size={20} />
                <span className="font-semibold">CPU USAGE</span>
              </div>
              <span className="text-gray-400">0%</span>
            </div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="text-blue-400" size={20} />
                <span className="font-semibold">MEMORY USAGE</span>
              </div>
              <span className="text-gray-400">21%</span>
            </div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '21%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="text-purple-400" size={20} />
                <span className="font-semibold">DISK USAGE</span>
              </div>
              <span className="text-gray-400">34%</span>
            </div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '34%' }}></div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Performance Metrics
          </h3>
          <div className="space-y-3">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <h4 className="font-semibold">cpu usage was under 25%</h4>
              </div>
              <p className="text-sm text-gray-400">Measured 0% usage over past 3 checks</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <h4 className="font-semibold">memory usage was under 25%</h4>
              </div>
              <p className="text-sm text-gray-400">Measured 20% usage over past 3 checks</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <h4 className="font-semibold">cpu usage was under 25%</h4>
              </div>
              <p className="text-sm text-gray-400">Measured 0% usage over past 3 checks</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ServerAnalytics;
