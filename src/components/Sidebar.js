import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { 
  CreditCard, 
  Home, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  Zap,
  ChevronDown,
  Building,
  DollarSign,
  Activity,
  Shield,
  Bot,
  ShoppingCart,
  TrendingUp,
  FileText,
  Play,
  Mic,
  Music,
  Video,
  Headphones,
  Star,
  LogOut,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ currentPage, onSectionChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSectionClick = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const navigationItems = [
    {
      title: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/admin",
      section: "admin"
    },
    {
      title: "Teams",
      icon: <Building className="w-5 h-5" />,
      path: "/admin",
      section: "admin"
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/admin",
      section: "admin"
    },
    {
      title: "Transactions",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin",
      section: "admin"
    }
  ];

  const teamItems = [
    {
      title: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/team/demo",
      section: "team",
      id: "dashboard"
    },
    {
      title: "Virtual Card",
      icon: <CreditCard className="w-5 h-5" />,
      path: "/team/demo",
      section: "team",
      id: "virtual-card"
    },
    {
      title: "API Marketplace",
      icon: <ShoppingCart className="w-5 h-5" />,
      path: "/team/demo",
      section: "team",
      id: "api-marketplace"
    },
    {
      title: "Budget Tracking",
      icon: <TrendingUp className="w-5 h-5" />,
      path: "/team/demo",
      section: "team",
      id: "budget-tracking"
    },
    {
      title: "Teams History",
      icon: <History className="w-5 h-5" />,
      path: "/team/demo",
      section: "team",
      id: "teams-history"
    }
  ];

  const playgroundItems = [
    {
      title: "AI Budget Assistant",
      icon: <Bot className="w-5 h-5" />,
      path: "/team/demo",
      section: "team"
    },
    {
      title: "Voice Commands",
      icon: <Mic className="w-5 h-5" />,
      path: "/team/demo",
      section: "team"
    },
    {
      title: "Smart Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/team/demo",
      section: "team"
    }
  ];

  const getCurrentItems = () => {
    if (currentPage === "admin") return navigationItems;
    return [...teamItems, ...playgroundItems];
  };

  const isActive = (path) => {
    if (path === "/admin") {
      // For admin home, only active if we're exactly on /admin (not /admin/users)
      return location.pathname === "/admin";
    }
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 relative`}
    >
      {/* Branding Section */}
      <div className="p-6 border-b border-gray-200 relative">
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-3 mb-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold text-gray-900">HackerCard</span>}
        </motion.button>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Finance Platform</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Collapse Toggle Button - Always Visible at Bottom */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 left-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-sm text-gray-600 bg-white border border-gray-200 shadow-sm"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
        {!isCollapsed && <span>Collapse</span>}
      </motion.button>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">
        {getCurrentItems().map((item, index) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              if (item.id) {
                // Use hash navigation for team sections
                window.location.hash = item.id;
              } else {
                navigate(item.path);
              }
            }}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg text-left transition-all ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={isCollapsed ? item.title : ''}
          >
            <div className={`${
              isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {item.icon}
            </div>
            {!isCollapsed && <span className="font-medium">{item.title}</span>}
          </motion.button>
        ))}
      </div>

      {/* Upgrade Section */}
      <div className="px-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-semibold flex items-center ${isCollapsed ? 'justify-center' : 'justify-center space-x-2'} hover:from-orange-600 hover:to-red-600 transition-all shadow-lg`}
          title={isCollapsed ? 'Upgrade Pro' : ''}
        >
          <Zap className="w-4 h-4" />
          {!isCollapsed && <span>Upgrade Pro</span>}
        </motion.button>
      </div>

      {/* User Profile Section */}
      <div className="px-4 pb-20 border-t border-gray-200 pt-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-3`}>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">MG</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Mariana Isabel Gonz...</p>
                <p className="text-xs text-gray-500">My Workspace</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </>
          )}
        </div>
        
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-center space-x-2'} px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all border border-transparent hover:border-red-200`}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
