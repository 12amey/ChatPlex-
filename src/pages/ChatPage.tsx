import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  Settings, 
  MoreVertical,
  Trash2,
  Download,
  RefreshCw,
  Zap,
  Clock,
  DollarSign,
  Heart
} from 'lucide-react';
import { usePlatform, type LLMProvider } from '../contexts/PlatformContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import ChatMessage from '../components/chat/ChatMessage';
import TypingIndicator from '../components/chat/TypingIndicator';
import ProviderSelector from '../components/chat/ProviderSelector';

const providerInfo: Record<LLMProvider, { name: string; color: string; avatar: string }> = {
  openai: { name: 'OpenAI GPT-4', color: 'from-green-500 to-teal-500', avatar: '🤖' },
  gemini: { name: 'Google Gemini', color: 'from-blue-500 to-indigo-500', avatar: '💎' },
  anthropic: { name: 'Claude', color: 'from-orange-500 to-red-500', avatar: '🧠' },
  groq: { name: 'Groq', color: 'from-purple-500 to-pink-500', avatar: '⚡' }
};

export default function ChatPage() {
  const { agentId } = useParams();
  const { agents, sendMessage, getConversation, getConversationMessages, clearConversation, isStreaming, currentProvider, setCurrentProvider } = usePlatform();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agent = agents.find(a => a.id === agentId);
  const conversation = getConversation(agentId || '');
  const messages = conversation ? getConversationMessages(conversation.id) : [];
  
  console.log('ChatPage - Agent:', agent);
  console.log('ChatPage - Conversation:', conversation);
  console.log('ChatPage - Messages:', messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with input:', input);
    if (!input.trim() || !agentId || isStreaming) return;

    const message = input.trim();
    setInput('');
    console.log('Sending message:', message, 'to agent:', agentId);
    await sendMessage(agentId, message);
  };

  const handleClearChat = () => {
    if (agentId) {
      clearConversation(agentId);
    }
  };

  const handleProviderSwitch = (provider: LLMProvider) => {
    setCurrentProvider(provider);
    setShowSettings(false);
  };

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Agent Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            The requested agent doesn't exist or has been removed.
          </p>
          <Link to="/" className="inline-block">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="inline-block">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{agent.avatar}</div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {agent.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {agent.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Current Provider Indicator */}
            <motion.div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${providerInfo[currentProvider].color} text-white text-sm font-medium flex items-center space-x-1 shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{providerInfo[currentProvider].avatar}</span>
              <span>{providerInfo[currentProvider].name}</span>
            </motion.div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50"
                  >
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        Switch Provider
                      </h3>
                      <ProviderSelector 
                        currentProvider={currentProvider}
                        onProviderChange={handleProviderSwitch}
                      />
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleClearChat}
                        title="Clear all messages in this conversation"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Conversation
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => {
                          const chatData = {
                            agent: agent.name,
                            messages: messages,
                            timestamp: new Date().toISOString()
                          };
                          const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `chat-${agent.name}-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        title="Download chat history as JSON"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Chat
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {!messages || messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">{agent.avatar}</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                I'm {agent.name}, ready to help with {agent.description.toLowerCase()}.
              </p>
              
              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {agent.id === 'travel-agent' ? [
                  "What tours are available in Italy?",
                  "Plan a 7-day trip to Japan",
                  "Best time to visit Europe?",
                  "Luxury hotels in Bali recommendations"
                ] : [
                  "I'm having trouble with the API",
                  "How do I integrate the SDK?",
                  "My webhook isn't working",
                  "Need help with authentication"
                ].map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="text-sm text-slate-900 dark:text-white font-medium">
                      {prompt}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id}
                  message={message} 
                  agent={agent}
                  index={index}
                />
              ))}
              
              {isStreaming && (
                <TypingIndicator agent={agent} />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Stats Bar */}
          {conversation && messages && messages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-6 mb-4 text-xs text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Avg: 1.2s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{messages.filter(m => m.role === 'assistant').length} responses</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>${conversation.total_cost.toFixed(4)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{conversation.sentiment}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${agent.name}...`}
                disabled={isStreaming}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed pr-12"
              />
              {input && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400"
                >
                  {input.length}/2000
                </motion.div>
              )}
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {isStreaming ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
          
          <div className="text-center mt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by {providerInfo[currentProvider].name} • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}