import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { useRealtime } from '../../contexts/RealtimeContext';

export default function RealtimeMetrics() {
  const { metrics, subscribeToMetrics, unsubscribeFromMetrics } = useRealtime();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    subscribeToMetrics();
    setIsVisible(true);

    return () => {
      unsubscribeFromMetrics();
    };
  }, [subscribeToMetrics, unsubscribeFromMetrics]);

  const metricsData = [
    {
      label: 'Messages/sec',
      value: metrics.messagesPerSecond.toFixed(0),
      icon: MessageSquare,
      color: 'from-primary-500 to-primary-600',
      change: '+12%'
    },
    {
      label: 'Active Chats',
      value: metrics.activeConversations.toLocaleString(),
      icon: Activity,
      color: 'from-success-500 to-success-600',
      change: '+5%'
    },
    {
      label: 'Avg Latency',
      value: `${metrics.averageLatency.toFixed(1)}s`,
      icon: Clock,
      color: 'from-warning-500 to-warning-600',
      change: '-8%'
    },
    {
      label: 'Error Rate',
      value: `${(metrics.errorRate * 100).toFixed(2)}%`,
      icon: AlertCircle,
      color: 'from-error-500 to-error-600',
      change: '-15%'
    }
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${metric.color} text-white shadow-lg`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              metric.change.startsWith('+') 
                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
            }`}>
              {metric.change}
            </div>
          </div>
          
          <motion.div
            key={metric.value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-neutral-900 dark:text-white mb-1"
          >
            {metric.value}
          </motion.div>
          
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {metric.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}