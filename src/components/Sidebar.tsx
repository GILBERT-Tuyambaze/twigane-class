import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  Users, 
  Trophy, 
  User, 
  Code,
  MessageSquare,
  Target
} from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Code, label: 'Practice', path: '/practice' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: MessageSquare, label: 'Community', path: '/community' },
  { icon: Target, label: 'Challenges', path: '/challenges' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-orange-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white"
                  : "hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};