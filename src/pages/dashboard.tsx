import { motion } from 'framer-motion';
import { Server, DollarSign, Database, HardDrive, Users, BookOpen, MessageCircle, Plus, ShoppingCart, Coins } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [hasServers] = useState(false);

  const stats = [
    { label: 'Servers', value: '3', icon: Server },
    { label: 'Credits', value: '30¢', icon: DollarSign },
    { label: 'Memory', value: '512 MB', icon: Database },
    { label: 'Disk', value: '1 GB', icon: HardDrive },
    { label: 'Backups', value: '1', icon: Users },
    { label: 'Databases', value: '0', icon: Database },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <div className="container mx-auto px-4 py-20 pt-32">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, User!</h1>
              <p className="text-gray-300">Ready to build something amazing?</p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Server className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-blue-400">⚡</span> Quick Actions
          </h2>
          <p className="text-gray-400 mb-6">Get started with these quick options</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Create Server */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Server className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Server</h3>
                <p className="text-gray-400 mb-4 text-sm">Deploy a new server with your preferred configuration and resources</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Create Now
                </button>
              </div>
            </motion.div>

            {/* Buy Resources */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Buy Resources</h3>
                <p className="text-gray-400 mb-4 text-sm">Upgrade your existing servers with additional CPU, RAM, and storage</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  View Resources
                </button>
              </div>
            </motion.div>

            {/* Earn Credits */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Credits</h3>
                <p className="text-gray-400 mb-4 text-sm">Get more credits through donations, reviews, or like earning</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Get Credits
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Servers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Your Servers</h2>
          
          {!hasServers ? (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
              <Server className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">You don't have any servers yet</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first server!</p>
              
              {/* Example Server Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="max-w-2xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 cursor-pointer shadow-lg"
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
                    <p className="text-white font-bold text-lg">orihost.com</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Server cards would go here when user has servers */}
            </div>
          )}
        </motion.div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-6">Our support team is here to help you get the most out of your hosting experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
              <BookOpen size={20} />
              DOCUMENTATION
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              DISCORD SUPPORT
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
