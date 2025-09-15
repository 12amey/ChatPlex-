import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Copy, 
  CheckCircle, 
  Download, 
  ExternalLink, 
  Package, 
  Zap,
  Settings,
  Palette,
  Globe,
  Shield,
  BookOpen,
  Github,
  Terminal,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';

const installationSteps = [
  {
    title: 'Install the SDK',
    code: 'npm install @chatplex/sdk',
    description: 'Add our React SDK to your project'
  },
  {
    title: 'Import Components',
    code: `import { useChat, ChatWidget } from '@chatplex/sdk';`,
    description: 'Import the hooks and components you need'
  },
  {
    title: 'Add to Your App',
    code: `function App() {
  const { messages, sendMessage } = useChat('travel-agent');
  return (
    <div>
      <ChatWidget agentId="travel-agent" />
    </div>
  );
}`,
    description: 'Integrate the chat widget with a single component'
  }
];

const examples = [
  {
    title: 'Basic Integration',
    description: 'Simple chat widget with default styling',
    code: `import { ChatWidget } from '@chatplex/sdk';

function App() {
  return (
    <ChatWidget 
      agentId="support-agent"
      theme="light"
      position="bottom-right"
    />
  );
}`
  },
  {
    title: 'Custom Hook Usage',
    description: 'Full control with the useChat hook',
    code: `import { useChat } from '@chatplex/sdk';

function CustomChat() {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useChat('travel-agent', {
    apiKey: 'your-api-key',
    baseUrl: 'https://api.chatplex.com'
  });

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input 
        onSubmit={(e) => sendMessage(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
}`
  },
  {
    title: 'Advanced Configuration',
    description: 'Full customization with event handlers',
    code: `import { ChatWidget } from '@chatplex/sdk';

function App() {
  return (
    <ChatWidget 
      agentId="travel-agent"
      config={{
        provider: 'openai',
        temperature: 0.7,
        maxTokens: 1000,
        tools: ['contentstack', 'booking-api']
      }}
      theme={{
        primary: '#3b82f6',
        background: '#ffffff',
        text: '#1f2937'
      }}
      onMessage={(message) => {
        console.log('New message:', message);
      }}
      onError={(error) => {
        console.error('Chat error:', error);
      }}
      features={{
        streaming: true,
        typing: true,
        sentiment: true,
        translation: true
      }}
    />
  );
}`
  }
];

const features = [
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'SSE/WebSocket support for instant responses',
    color: 'text-yellow-500'
  },
  {
    icon: Settings,
    title: 'Full Configuration',
    description: 'Control every aspect of your agent behavior',
    color: 'text-blue-500'
  },
  {
    icon: Palette,
    title: 'Theme Customization',
    description: 'Match your brand with custom themes',
    color: 'text-purple-500'
  },
  {
    icon: Globe,
    title: 'Multi-language',
    description: 'Built-in translation and localization',
    color: 'text-green-500'
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'API key management and rate limiting',
    color: 'text-red-500'
  },
  {
    icon: Package,
    title: 'TypeScript Support',
    description: 'Full type definitions included',
    color: 'text-indigo-500'
  }
];

export default function SDKPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeExample, setActiveExample] = useState(0);

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 mb-6">
              <Code className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                React SDK Documentation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6">
              Integrate in Minutes
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Scale to Millions
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Our React SDK makes it incredibly easy to add intelligent chat agents 
              to any application with just a few lines of code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                onClick={() => window.open('https://www.npmjs.com/package/@chatplex/sdk', '_blank')}
              >
                <Download className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold"
                onClick={() => window.open('https://github.com/chatplex/sdk', '_blank')}
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Quick Start Guide
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Get your chat agent running in under 60 seconds
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {installationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  
                  <div className="relative mb-4">
                    <pre className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                      {step.code}
                    </pre>
                    <button
                      onClick={() => handleCopyCode(step.code, `step-${index}`)}
                      className="absolute top-2 right-2 p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedCode === `step-${index}` ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Everything you need for production-ready chat experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${
                    feature.color === 'text-yellow-500' ? 'from-yellow-500 to-orange-500' :
                    feature.color === 'text-blue-500' ? 'from-blue-500 to-indigo-500' :
                    feature.color === 'text-purple-500' ? 'from-purple-500 to-violet-500' :
                    feature.color === 'text-green-500' ? 'from-green-500 to-emerald-500' :
                    feature.color === 'text-red-500' ? 'from-red-500 to-pink-500' :
                    'from-indigo-500 to-purple-500'
                  } text-white mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Code Examples */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Code Examples
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                From basic integration to advanced customization
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Example Tabs */}
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <motion.div
                    key={example.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      activeExample === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md'
                    }`}
                    onClick={() => setActiveExample(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {example.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {example.description}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        activeExample === index ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Code Display */}
              <motion.div
                key={activeExample}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 shadow-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(examples[activeExample].code, `example-${activeExample}`)}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedCode === `example-${activeExample}` ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <pre className="text-sm font-mono text-green-400 overflow-x-auto">
                    {examples[activeExample].code}
                  </pre>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* API Reference */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-center"
          >
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers using our SDK to create incredible chat experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo" className="inline-block">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl">
                  <Terminal className="w-5 h-5 mr-2" />
                  Start Building
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Full Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}