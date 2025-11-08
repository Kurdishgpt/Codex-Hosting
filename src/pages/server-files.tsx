import { motion } from 'framer-motion';
import { Folder, File, Upload, FolderPlus, FileText, MoreVertical, Server } from 'lucide-react';
import ServerNav from '../components/ServerNav';

const ServerFiles = () => {
  const files = [
    { name: '.cache', type: 'folder', modified: 'about 3 hours ago' },
    { name: '.npm', type: 'folder', modified: 'about 15 hours ago' },
    { name: '.upm', type: 'folder', modified: 'about 15 hours ago' },
    { name: 'scheduled_updates', type: 'folder', modified: 'about 15 hours ago' },
    { name: 'commands', type: 'folder', modified: 'about 15 hours ago' },
    { name: 'db', type: 'folder', modified: 'about 14 hours ago' },
    { name: 'node_modules', type: 'folder', modified: 'about 14 hours ago' },
    { name: 'utils', type: 'folder', modified: 'about 14 hours ago' },
    { name: '.env', type: 'file', size: '203 Bytes', modified: '2 days ago' },
    { name: '.gitignore', type: 'file', size: '32 bytes', modified: '2 days ago' },
    { name: 'index.js', type: 'file', size: '8.62 KiB', modified: '2 days ago' },
    { name: 'package-lock.json', type: 'file', size: '106.43 KiB', modified: 'about 14 hours ago' },
    { name: 'package.json', type: 'file', size: '637 bytes', modified: 'about 14 hours ago' },
    { name: 'template.json', type: 'file', size: '3.28 KiB', modified: '2 days ago' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="pt-20">
        <ServerNav />
      </div>
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">File Manager</h1>
          <p className="text-gray-400">Create, edit, and manage files on your server</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6"
        >
          <input 
            type="text" 
            placeholder="Search files and folders..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-4"
          />

          <div className="flex gap-2 mb-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <FolderPlus size={18} />
              Create Directory
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Upload size={18} />
              Upload
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Server size={18} />
              Pull Remote File
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <FileText size={18} />
              New File
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <p className="text-sm text-gray-400">/home › container ›</p>
            </div>
            
            <div className="divide-y divide-gray-700">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input type="checkbox" className="w-4 h-4" />
                    {file.type === 'folder' ? (
                      <Folder className="text-blue-400" size={20} />
                    ) : (
                      <File className="text-gray-400" size={20} />
                    )}
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {file.size && <span className="text-gray-400 text-sm">{file.size}</span>}
                    <span className="text-gray-400 text-sm w-40">{file.modified}</span>
                    <button className="text-gray-400 hover:text-white">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
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
            <Server className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">SFTP Connection Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Host Address</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <code className="text-white text-sm">sftp://de-vip-01.orihost.com:2022</code>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Port</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <code className="text-white text-sm">2022</code>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Username</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <code className="text-white text-sm">wednesday-bcb2eb5b</code>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Password</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <code className="text-white text-sm">Your current panel password</code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-4">
            <p className="text-gray-400 text-sm mb-2">Quick Connect URL</p>
            <code className="text-green-400 text-sm">sftp://wednesday-bcb2eb5b@de-vip-01.orihost.com:2022</code>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 flex items-start gap-3">
            <Server className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-blue-200">
                <strong>Need help with SFTP?</strong> Contact our support team.
              </p>
              <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                Launch SFTP
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ServerFiles;
