import React from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../../contexts/PlatformContext';

interface TypingIndicatorProps {
  agent: Agent;
}

export default function TypingIndicator({ agent }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-3xl mr-12">
        <div className="flex items-start space-x-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 text-2xl"
          >
            {agent.avatar}
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {agent.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                is typing...
              </span>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm max-w-fit"
            >
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}