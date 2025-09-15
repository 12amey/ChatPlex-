import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, 
  ArrowLeft, 
  Zap, 
  Globe, 
  Brain, 
  MessageSquare,
  Code,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { usePlatform } from '../contexts/PlatformContext';

const demoSteps = [
  {
    id: 'travel-query',
    title: 'Travel Website Integration',
    description: 'Ask about tours in Italy and see RAG in action',
    icon: Globe,
    color: 'from-blue-500 to-indigo-500',
    query: 'What tours are available in Italy?'
  },
  {
    id: 'provider-switch',
    title: 'Multi-LLM Provider Switch',
    description: 'Switch between OpenAI, Gemini, and Groq seamlessly',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    query: 'Plan a 7-day romantic trip to Venice'
  },
  {
    id: 'rag-demo',
    title: 'RAG Pipeline Demo',
    description: 'Semantic search with Contentstack CMS integration',
    icon: Brain,
    color: 'from-green-500 to-emerald-500',
    query: 'Tell me about luxury hotels in Tuscany with wine tastings'
  },
  {
    id: 'sdk-integration',
    title: 'React SDK Integration',
    description: 'Add chatbot to any React app with 3 lines of code',
    icon: Code,
    color: 'from-orange-500 to-red-500',
    code: `import { useChat, ChatWidget } from '@chatplex/sdk';

function App() {
  const { messages, sendMessage } = useChat('travel-agent');
  return <ChatWidget agentId="travel-agent" />;
}`
  }
];

const features = [
  'Multi-LLM API Gateway (OpenAI, Gemini, Anthropic, Groq)',
  'Real-time streaming with SSE/WebSockets',
  'Contentstack CMS integration with RAG',
  'Vector database for semantic search',
  'Advanced analytics and monitoring',
  'One-click React SDK integration',
  'Auto-failover and load balancing',
  'Sentiment analysis and translations'
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const { agents } = usePlatform();

  const handleCopyCode = async () => {
    const code = demoSteps.find(step => step.code)?.code;
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <Navbar />
      
      <div className="px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Live Interactive Demo
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6">
              Experience the Future
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                of Chat Agents
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              See our complete platform in action with real-world scenarios, 
              multi-LLM switching, and production-ready integrations.
            </p>
          </motion.div>

          {/* Demo Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Steps List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Interactive Demo Flow
              </h3>
              {demoSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeStep === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {step.description}
                      </p>
                      {step.query && (
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
                          <MessageSquare className="w-3 h-3 mr-2" />
                          "{step.query}"
                        </div>
                      )}
                      {step.code && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-900 dark:bg-slate-950 relative">
                          <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                            {step.code}
                          </pre>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCode();
                            }}
                            className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedCode ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      activeStep === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {activeStep === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Demo Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  chatplex-demo.vercel.app
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <div className="text-green-400 font-mono text-sm">
                        $ Simulating travel website integration...
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                            U
                          </div>
                          <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tl-none max-w-xs">
                            What tours are available in Italy?
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">✈️</div>
                          <div className="bg-slate-700 text-slate-100 p-3 rounded-lg rounded-tl-none flex-1">
                            <div className="text-sm text-slate-400 mb-2">Travel Assistant • OpenAI GPT-4</div>
                            <div className="text-sm">
                              I'd be happy to help! Here are amazing tour options from our CMS:
                              <br /><br />
                              🏛️ <strong>Classical Rome & Vatican Tour</strong> (5 days)<br />
                              - Colosseum, Roman Forum, Vatican Museums<br />
                              - Price: €899 per person
                            </div>
                            <div className="flex items-center space-x-3 mt-3 text-xs text-slate-400">
                              <span>⚡ 1.2s</span>
                              <span>🎯 156 tokens</span>
                              <span>💰 $0.0234</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="text-green-400 font-mono text-sm">
                        $ Provider switching: OpenAI → Gemini → Groq
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Active Provider:</span>
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-green-600 text-white rounded">🤖 OpenAI</span>
                            <span className="px-2 py-1 bg-blue-600 text-white rounded">💎 Gemini</span>
                            <span className="px-2 py-1 bg-purple-600 text-white rounded">⚡ Groq</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">
                          <div className="mb-2">✅ Failover test complete</div>
                          <div>🔄 Response comparison across providers</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <div className="text-green-400 font-mono text-sm">
                        $ RAG Pipeline: Contentstack → Embeddings → LLM
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="text-xs text-slate-400 space-y-1">
                          <div>🔍 Semantic search: "luxury hotels tuscany wine"</div>
                          <div>📊 Vector similarity: 0.89 match found</div>
                          <div>📄 Retrieved: 3 CMS entries</div>
                        </div>
                        <div className="bg-slate-700 p-3 rounded text-sm text-slate-200">
                          Based on our Contentstack CMS, here are luxury hotels in Tuscany with wine experiences:
                          <br /><br />
                          🍷 <strong>Villa San Michele</strong> - Belmond property with vineyard tours...
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="text-green-400 font-mono text-sm">
                        $ React SDK Integration Demo
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-3">install & integrate:</div>
                        <div className="bg-slate-900 p-3 rounded text-xs font-mono text-green-400 mb-3">
                          npm install @chatplex/sdk<br />
                          # 3 lines of code = full chatbot
                        </div>
                        <div className="text-sm text-slate-300">
                          ✨ Widget appears instantly<br />
                          🎨 Fully customizable themes<br />
                          ⚡ Real-time streaming ready
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400">
                  Step {activeStep + 1} of {demoSteps.length}
                </div>
                <div className="flex space-x-2">
                  {demoSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === activeStep ? 'bg-blue-500' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to={`/chat/${agents[0]?.id}`} className="inline-block">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl">
                <Play className="w-5 h-5 mr-2" />
                Try Live Chat
              </Button>
            </Link>
            <Link to="/admin" className="inline-block">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                View Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Features Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              🏆 Complete Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}