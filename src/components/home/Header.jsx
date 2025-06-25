import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiInfo, FiHome, FiCalendar, FiUser, FiSettings } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { PoornimaLogo } from '../common/PoornimaLogo';

const navItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Schedule', icon: FiCalendar, path: '/schedule' },
  { name: 'Profile', icon: FiUser, path: '/profile' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

export const Header = ({ onToggleRules, showRules }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              Poornima Mess
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${location.pathname === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="mr-2" />
                {item.name}
              </motion.button>
            ))}
            <motion.button
              onClick={onToggleRules}
              className="ml-2 px-4 py-2 rounded-lg font-medium flex items-center text-gray-600 hover:bg-gray-100 transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiInfo className="mr-2" />
              {showRules ? 'Hide Rules' : 'Rules'}
            </motion.button>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'bg-gray-100' : 'bg-white/20'} transition-colors`}
            aria-expanded={isMobileMenuOpen}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <FiX className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <FiMenu className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="md:hidden fixed top-20 right-4 left-4 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3" />
                    {item.name}
                  </motion.button>
                ))}
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={() => {
                    onToggleRules();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center text-gray-700 hover:bg-gray-50"
                >
                  <FiInfo className="mr-3" />
                  {showRules ? 'Hide Rules' : 'Mess Rules'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center text-red-600 hover:bg-red-50 mt-1"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            </motion.div>
            <motion.div 
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
