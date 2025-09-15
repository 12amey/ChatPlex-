import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { useRealtime } from '../../contexts/RealtimeContext';

export default function ConnectionStatus() {
  const { connectionStatus, isConnected, activeUsers, systemHealth } = useRealtime();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-warning-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-error-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'from-success-500 to-success-600';
      case 'connecting':
        return 'from-warning-500 to-warning-600';
      case 'error':
        return 'from-error-500 to-error-600';
      default:
        return 'from-neutral-500 to-neutral-600';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success-500';
      case 'degraded':
        return 'bg-warning-500';
      default:
        return 'bg-error-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 right-6 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-4 min-w-[280px]"
      >
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
              {connectionStatus}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor()} text-white text-xs font-medium`}>
            Real-time
          </div>
        </div>

        {/* Active Users */}
        {isConnected && (
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              {activeUsers.toLocaleString()} active users
            </span>
          </div>
        )}

        {/* System Health */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            System Health
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(systemHealth).map(([service, status]) => (
              <div key={service} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(status)}`} />
                <span className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-success-500 to-success-600"
          animate={{
            scale: isConnected ? [1, 1.2, 1] : 1,
            opacity: isConnected ? [1, 0.7, 1] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: isConnected ? Infinity : 0,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}