import { motion } from 'framer-motion';
import { User, Mail, MessageCircle, Server } from 'lucide-react';
import { useState } from 'react';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('jnahmud3@gmail.com');
  const [isDiscordLinked] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="container mx-auto px-4 py-20 pt-32 max-w-6xl">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Update your account information and connect external services</p>
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 mb-8"
        >
          <p className="text-sm">
            <span className="font-semibold">Premium Bot Hosting for €0.29/month with latency as low as 20ms →</span>{' '}
            <a href="/discord" className="text-blue-400 hover:underline">https://codex.com/bot-hosting/</a>
            <br />
            Discord Server for support:{' '}
            <a href="https://discord.gg/FnEe7xcYZQ" className="text-blue-400 hover:underline">https://discord.gg/FnEe7xcYZQ</a>
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Update Username */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Update Username</h3>
                <p className="text-sm text-gray-400">Change how you login to your account</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter new username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Update Username
              </button>
            </div>
          </motion.div>

          {/* Update Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Update Email Address</h3>
                <p className="text-sm text-gray-400">Update your contact email address</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Update Email
              </button>
            </div>
          </motion.div>

        </div>

        {/* Connect with Discord */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Connect with Discord</h3>
              <p className="text-sm text-gray-400">Link your Discord for additional features</p>
            </div>
          </div>
          
          <p className="text-gray-400 mb-4">
            {isDiscordLinked 
              ? 'Your account is linked to Discord.' 
              : 'Your account is not linked to Discord.'}
          </p>
          
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
            <MessageCircle size={20} />
            Link Discord Account
          </button>
        </motion.div>

        {/* Example Server Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-1">Discord Bot Hosting –</h4>
                <p className="text-lg font-semibold text-white/90">€0.30/mo</p>
                <p className="text-sm text-white/80">Ultra-low latency as low as 20ms</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-lg">codex.com</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AccountSettings;
