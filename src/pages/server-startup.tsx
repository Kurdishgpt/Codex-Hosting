import { motion } from 'framer-motion';
import { Terminal, Package, GitBranch, Upload, RefreshCw, FileCode, Key, Settings } from 'lucide-react';
import ServerNav from '../components/ServerNav';

const ServerStartup = () => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Startup Settings</h1>
          <p className="text-gray-400">Configure server startup parameters and variables</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Startup Command</h2>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-green-400">
              missage="*" if: -z "$&#123;GIT_ADDRESS&#125;"; && missage="GIT_ADDRESS"; fi -z "$&#123;USERNAME&#125;"; && missage="USERNAME"; fi -z "$&#123;ACCESS_TOKEN&#125;"; && missage="ACCESS_TOKEN"
            </code>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold">Docker Image</h2>
          </div>
          <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2">
            <option>Nodejs 20</option>
            <option>Nodejs 18</option>
            <option>Python 3.11</option>
            <option>Python 3.10</option>
          </select>
          <p className="text-gray-400 text-sm">Select a different Docker Image to use when starting this server.</p>
        </motion.div>

        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="text-green-400" size={20} />
              <h3 className="font-bold">Git Repo Address</h3>
            </div>
            <input 
              type="text" 
              defaultValue="https://github.com/KartikeSingh/PMI"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
            />
            <p className="text-gray-400 text-sm">GitHub Repo to clone i.e. https://github.com/username/repo_name</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="text-green-400" size={20} />
                <h3 className="font-bold">Install Branch</h3>
              </div>
              <input 
                type="text" 
                defaultValue="main"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">The branch to install.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="text-blue-400" size={20} />
                <h3 className="font-bold">Auto Update</h3>
              </div>
              <label className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-white">Disabled</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">Pull the latest files on startup when using a GitHub repo.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Upload className="text-yellow-400" size={20} />
              <h3 className="font-bold">User Uploaded Files</h3>
            </div>
            <label className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-2">
              <input type="checkbox" className="w-5 h-5" />
              <span className="text-white">Disabled</span>
            </label>
            <p className="text-gray-400 text-sm">Skip the install script if you are letting a user upload files. (e.g. not default) 1.3 sec</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-purple-400" size={20} />
                <h3 className="font-bold">Additional Node packages</h3>
              </div>
              <input 
                type="text" 
                placeholder="npm install names"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">Install additional node packages. Use spaces to separate.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Key className="text-orange-400" size={20} />
                <h3 className="font-bold">Git Username</h3>
              </div>
              <input 
                type="text" 
                placeholder="KartikeSingh"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">Username to auth with git.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Key className="text-red-400" size={20} />
                <h3 className="font-bold">Git Access Token</h3>
              </div>
              <input 
                type="password" 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">Password to use with git. try not to prefect to use a Personal Access Token. https://github.com/"profile/personal_access_tokens_killios</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-blue-400" size={20} />
                <h3 className="font-bold">Uninstall Node packages</h3>
              </div>
              <input 
                type="text" 
                placeholder=""
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">Uninstall node packages. Use spaces to separate.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileCode className="text-green-400" size={20} />
                <h3 className="font-bold">Main file</h3>
              </div>
              <input 
                type="text" 
                defaultValue="index.js"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">The file that starts the app. Can be an .bat .js</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-blue-400" size={20} />
                <h3 className="font-bold">Additional Arguments.</h3>
              </div>
              <input 
                type="text" 
                placeholder=""
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-2"
              />
              <p className="text-gray-400 text-sm">Any extra arguments for nodejs or node</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ServerStartup;
