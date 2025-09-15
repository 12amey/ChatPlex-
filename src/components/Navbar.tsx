import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Bot, Sun, Moon, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Demo', path: '/demo' },
  { label: 'Admin', path: '/admin' },
  { label: 'SDK', path: '/sdk' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            >
              <Bot className="w-6 h-6" />
            </motion.div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ChatPlex
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                Agent Platform
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.div>
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => window.open('https://github.com/chatplex/platform', '_blank')}
            >
              <Github className="w-5 h-5" />
            </Button>

            {/* Documentation Link */}
            <Link to="/sdk" className="inline-block">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Docs
              </Button>
            </Link>

            {/* Get Started */}
            <Link to="/demo" className="inline-block">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}