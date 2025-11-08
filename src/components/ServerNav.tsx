import { Link, useLocation } from 'react-router-dom';
import { Terminal, BarChart3, Settings, FolderOpen, Edit } from 'lucide-react';

const ServerNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Console', path: '/server/console', icon: Terminal },
    { name: 'Analytics', path: '/server/analytics', icon: BarChart3 },
    { name: 'Files', path: '/server/files', icon: FolderOpen },
    { name: 'Settings', path: '/server/startup', icon: Settings },
    { name: 'Edit', path: '/server/edit', icon: Edit },
  ];

  return (
    <div className="border-b border-gray-700 bg-gray-800/30 backdrop-blur-sm sticky top-16 z-10">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServerNav;
