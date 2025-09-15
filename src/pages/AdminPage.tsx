import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Globe,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Brain,
  Shield,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import ConnectionStatus from '../components/ui/ConnectionStatus';
import RealtimeMetrics from '../components/ui/RealtimeMetrics';
import { usePlatform } from '../contexts/PlatformContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { format, subDays, subHours } from 'date-fns';

// Mock analytics data
const generateMockData = () => ({
  usageData: Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM dd'),
    messages: Math.floor(Math.random() * 100) + 50,
    tokens: Math.floor(Math.random() * 5000) + 2500,
    cost: Math.random() * 5 + 2.5,
    latency: Math.random() * 0.5 + 0.5
  })),
  providerData: [
    { name: 'Gemini', value: 65, cost: 156.78, color: '#3b82f6' },
    { name: 'OpenAI', value: 20, cost: 234.56, color: '#10b981' },
    { name: 'Claude', value: 10, cost: 89.23, color: '#f97316' },
    { name: 'Groq', value: 5, cost: 25.67, color: '#8b5cf6' }
  ],
  sentimentData: [
    { name: 'Positive', value: 68, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Negative', value: 7, color: '#ef4444' }
  ]
});

export default function AdminPage() {
  const { agents, conversations } = usePlatform();
  const { metrics, subscribeToMetrics, unsubscribeFromMetrics } = useRealtime();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'agents' | 'analytics' | 'settings'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const mockData = useMemo(() => generateMockData(), [timeRange]);

  React.useEffect(() => {
    if (selectedTab === 'overview' || selectedTab === 'analytics') {
      subscribeToMetrics();
    }
    return () => unsubscribeFromMetrics();
  }, [selectedTab, subscribeToMetrics, unsubscribeFromMetrics]);

  const totalMessages = conversations.reduce((acc, conv) => acc + conv.total_messages, 0);
  const totalCost = conversations.reduce((acc, conv) => acc + conv.total_cost, 0);
  const avgLatency = metrics.averageLatency;

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Active Agents',
      value: agents.filter(a => a.isActive).length.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Total Cost',
      value: `$${totalCost.toFixed(2)}`,
      change: '-5.2%',
      trend: 'down' as const,
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Latency',
      value: `${avgLatency.toFixed(1)}s`,
      change: '-8.1%',
      trend: 'down' as const,
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-emerald-950 dark:to-cyan-950">
      <Navbar />
      <ConnectionStatus />
      
      <div className="px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Real-time Admin Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Monitor and manage your chat agents, live analytics, and real-time system performance
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-lg border border-neutral-200 dark:border-neutral-700 p-1">
                  {['1h', '24h', '7d', '30d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range as any)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        timeRange === range
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <Button className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Real-time Metrics */}
          <RealtimeMetrics />

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex space-x-1 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-lg border border-neutral-200 dark:border-neutral-700 p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        stat.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' :
                        stat.color === 'text-green-600' ? 'from-green-500 to-green-600' :
                        stat.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' :
                        'from-orange-500 to-orange-600'
                      } text-white`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Usage Trends */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Usage Trends
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const csvData = mockData.usageData.map(row => 
                          `${row.date},${row.messages},${row.tokens},${row.cost},${row.latency}`
                        ).join('\n');
                        const blob = new Blob([`Date,Messages,Tokens,Cost,Latency\n${csvData}`], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'usage-trends.csv';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  {/* Simple Chart Replacement */}
                  <div className="space-y-4">
                    {mockData.usageData.map((item, index) => (
                      <div key={item.date} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.date}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <span>{item.messages} msgs</span>
                          <span>{item.tokens.toLocaleString()} tokens</span>
                          <span>${item.cost.toFixed(2)}</span>
                          <span>{item.latency.toFixed(1)}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provider Distribution */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Provider Usage
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Last 30 days
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mockData.providerData.map((provider) => (
                      <div key={provider.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {provider.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {provider.value}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              ${provider.cost}
                            </div>
                          </div>
                          <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                backgroundColor: provider.color, 
                                width: `${provider.value}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Monitoring */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Real-time Performance
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Live</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Real-time metrics display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics.messagesPerSecond.toFixed(0)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Messages/sec</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {metrics.activeConversations}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Active Chats</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {metrics.averageLatency.toFixed(1)}s
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Avg Latency</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'agents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Agents Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Manage Agents
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Configure and monitor your chat agents
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search agents..."
                      className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{agent.avatar}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {agent.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-medium ${agent.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {conversations.filter(c => c.agent_id === agent.id).length}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Conversations</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {metrics.averageLatency.toFixed(1)}s
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Avg Latency</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ${conversations.filter(c => c.agent_id === agent.id).reduce((acc, c) => acc + c.total_cost, 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total Cost</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <Zap className="w-4 h-4" />
                        <span>Provider: {agent.provider}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${agent.name}?`)) {
                              // Delete agent logic would go here
                              alert('Agent deleted successfully!');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Advanced Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sentiment Analysis */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[300px]">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Sentiment Analysis
                  </h3>
                  <div className="space-y-3">
                    {mockData.sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[300px]">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Cost Breakdown
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      ${totalCost.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total cost this month
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[300px]">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Success Rate</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Token Efficiency</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Global Uptime</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Usage Trends */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Token Usage & Costs
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      <span onClick={() => {
                        const analyticsData = {
                          tokenUsage: mockData.usageData,
                          providerData: mockData.providerData,
                          sentimentData: mockData.sentimentData,
                          timestamp: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'analytics-data.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>
                        Export Data
                      </span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {mockData.usageData.reduce((acc, item) => acc + item.tokens, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Tokens Used
                    </div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      ${mockData.usageData.reduce((acc, item) => acc + item.cost, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Cost
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl space-y-8"
            >
              {/* API Configuration */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  API Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['OpenAI', 'Gemini', 'Anthropic', 'Groq'].map((provider) => (
                    <div key={provider} className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {provider} API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* System Settings */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  System Settings
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        Auto-failover
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Automatically switch to backup provider on failure
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        Analytics Collection
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Collect usage data for insights and optimization
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
                  onClick={() => {
                    // Save settings logic
                    alert('Settings saved successfully!');
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}