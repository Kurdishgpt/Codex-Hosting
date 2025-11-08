import { motion } from 'framer-motion';
import { Server, Trash2, Image, Edit3, RotateCcw, AlertTriangle } from 'lucide-react';
import ServerNav from '../components/ServerNav';

const ServerSettings = () => {
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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

      </div>
    </div>
  );
};

export default ServerSettings;
