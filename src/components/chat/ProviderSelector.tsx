import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { LLMProvider } from '../../contexts/PlatformContext';
import { providerManager } from '../../lib/providers';

interface ProviderSelectorProps {
  currentProvider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
}

const providers: Array<{
  id: LLMProvider;
  name: string;
  description: string;
  avatar: string;
  color: string;
}> = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Most capable, balanced performance',
    avatar: '🤖',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Fast reasoning, great for analysis',
    avatar: '💎',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'anthropic',
    name: 'Claude',
    description: 'Excellent for creative tasks',
    avatar: '🧠',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference speed',
    avatar: '⚡',
    color: 'from-purple-500 to-pink-500'
  }
];

const statusColors = {
  online: 'bg-green-500',
  error: 'bg-yellow-500',
  offline: 'bg-red-500'
};

export default function ProviderSelector({ currentProvider, onProviderChange }: ProviderSelectorProps) {
  const getProviderStatus = (providerId: LLMProvider) => {
    return providerManager.getProviderStatus(providerId);
  };

  return (
    <div className="space-y-2">
      {providers.map((provider) => (
        <motion.button
          key={provider.id}
          onClick={() => onProviderChange(provider.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
            currentProvider === provider.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${provider.color} flex items-center justify-center text-white text-sm font-medium`}>
                  {provider.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${statusColors[getProviderStatus(provider.id)]}`} />
              </div>
              
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {provider.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {provider.description}
                </div>
              </div>
            </div>

            {currentProvider === provider.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-blue-500"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}