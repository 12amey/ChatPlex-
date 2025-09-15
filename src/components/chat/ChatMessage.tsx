import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Zap, Clock, DollarSign, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { Agent } from '../../contexts/PlatformContext';
import type { Message } from '../../lib/supabase';
import Button from '../ui/Button';

interface ChatMessageProps {
  message: Message;
  agent: Agent;
  index: number;
}

const providerColors = {
  openai: 'from-green-500 to-teal-500',
  gemini: 'from-blue-500 to-indigo-500',
  anthropic: 'from-orange-500 to-red-500',
  groq: 'from-purple-500 to-pink-500'
};

export default function ChatMessage({ message, agent, index }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
        <div className="flex items-start space-x-3">
          {message.role === 'assistant' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex-shrink-0 text-2xl"
            >
              {agent.avatar}
            </motion.div>
          )}
          
          <div className="flex-1">
            {message.role === 'assistant' && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {agent.name}
                </span>
                {message.provider && (
                  <span className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${providerColors[message.provider]} shadow-sm`}>
                    {message.provider}
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
              </div>
            )}

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm'
              }`}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {message.content.split('\n').map((paragraph, i) => {
                  // Handle code blocks
                  if (paragraph.startsWith('```')) {
                    return (
                      <pre key={i} className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto mt-2">
                        <code className="text-sm">{paragraph.replace(/```\w*/, '').trim()}</code>
                      </pre>
                    );
                  }
                  
                  // Handle bold text
                  if (paragraph.includes('**')) {
                    const parts = paragraph.split('**');
                    return (
                      <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                        {parts.map((part, j) => 
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  
                  // Handle lists
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-4 mb-1 leading-relaxed">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  
                  // Regular paragraphs
                  return paragraph.trim() ? (
                    <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ) : null;
                })}
              </div>
            </motion.div>

            {message.role === 'assistant' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex items-center justify-between mt-3"
              >
                {/* Metadata */}
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  {message.latency > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{message.latency.toFixed(1)}s</span>
                    </div>
                  )}
                  {message.tokens > 0 && (
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{message.tokens} tokens</span>
                    </div>
                  )}
                  {message.cost > 0 && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${message.cost.toFixed(4)}</span>
                    </div>
                  )}
                  {message.sentiment && message.sentiment !== 'neutral' && (
                    <span className={`px-2 py-1 rounded-full ${
                      message.sentiment === 'positive' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : message.sentiment === 'negative'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {message.sentiment}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="p-1 h-7 w-7 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('positive')}
                    className={`p-1 h-7 w-7 ${
                      feedback === 'positive' 
                        ? 'text-green-500' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('negative')}
                    className={`p-1 h-7 w-7 ${
                      feedback === 'negative' 
                        ? 'text-red-500' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}