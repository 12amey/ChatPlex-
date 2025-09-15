import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DatabaseService, subscribeToAnalytics, subscribeToUserSessions } from '../lib/supabase';

interface RealtimeContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  activeUsers: number;
  systemHealth: {
    api: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    websocket: 'healthy' | 'degraded' | 'down';
  };
  metrics: {
    messagesPerSecond: number;
    activeConversations: number;
    averageLatency: number;
    errorRate: number;
    totalMessagesToday: number;
    totalCostToday: number;
  };
  subscribeToChat: (conversationId: string) => void;
  unsubscribeFromChat: (conversationId: string) => void;
  subscribeToMetrics: () => void;
  unsubscribeFromMetrics: () => void;
  sendRealtimeMessage: (conversationId: string, message: any) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [activeUsers, setActiveUsers] = useState(0);
  const [systemHealth, setSystemHealth] = useState({
    api: 'healthy' as const,
    database: 'healthy' as const,
    websocket: 'healthy' as const,
  });
  const [metrics, setMetrics] = useState({
    messagesPerSecond: 0,
    activeConversations: 0,
    averageLatency: 0,
    errorRate: 0,
    totalMessagesToday: 0,
    totalCostToday: 0,
  });

  const [metricsSubscription, setMetricsSubscription] = useState<any>(null);
  const [userSessionSubscription, setUserSessionSubscription] = useState<any>(null);

  // Initialize real-time connections
  useEffect(() => {
    const initializeConnections = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Test database connection
        await DatabaseService.getRealTimeMetrics();
        setIsConnected(true);
        setConnectionStatus('connected');
        setSystemHealth(prev => ({ ...prev, database: 'healthy', websocket: 'healthy' }));
        
        // Load initial metrics
        await loadMetrics();
        
        // Load initial active user count
        const userCount = await DatabaseService.getActiveUserCount();
        setActiveUsers(userCount);
        
      } catch (error) {
        console.error('Error initializing real-time connections:', error);
        setConnectionStatus('error');
        setSystemHealth(prev => ({ ...prev, database: 'degraded' }));
      }
    };

    initializeConnections();
  }, []);

  const loadMetrics = useCallback(async () => {
    try {
      const realTimeMetrics = await DatabaseService.getRealTimeMetrics();
      setMetrics({
        messagesPerSecond: realTimeMetrics.messages_per_second || 0,
        activeConversations: realTimeMetrics.active_conversations || 0,
        averageLatency: realTimeMetrics.average_latency || 0,
        errorRate: realTimeMetrics.error_rate || 0,
        totalMessagesToday: realTimeMetrics.total_messages_today || 0,
        totalCostToday: realTimeMetrics.total_cost_today || 0,
      });
      
      setActiveUsers(realTimeMetrics.active_users || 0);
      setSystemHealth(prev => ({ ...prev, api: 'healthy' }));
    } catch (error) {
      console.error('Error loading metrics:', error);
      setSystemHealth(prev => ({ ...prev, api: 'degraded' }));
    }
  }, []);

  // Refresh metrics periodically
  useEffect(() => {
    const metricsInterval = setInterval(loadMetrics, 10000); // Every 10 seconds
    return () => clearInterval(metricsInterval);
  }, [loadMetrics]);

  const subscribeToChat = useCallback((conversationId: string) => {
    console.log(`🔔 Subscribing to chat: ${conversationId}`);
    // This would be implemented with Supabase real-time subscriptions
    // for individual conversation updates
  }, []);

  const unsubscribeFromChat = useCallback((conversationId: string) => {
    console.log(`🔕 Unsubscribing from chat: ${conversationId}`);
  }, []);

  const subscribeToMetrics = useCallback(() => {
    console.log('📊 Subscribing to real-time metrics');
    
    if (metricsSubscription) {
      metricsSubscription.unsubscribe();
    }

    // Subscribe to analytics updates
    const analyticsSubscription = subscribeToAnalytics((analytics) => {
      console.log('📊 New analytics data:', analytics);
      // Refresh metrics when new analytics data comes in
      loadMetrics();
    });

    setMetricsSubscription(analyticsSubscription);

    // Subscribe to user session updates
    if (userSessionSubscription) {
      userSessionSubscription.unsubscribe();
    }

    const sessionSubscription = subscribeToUserSessions((session) => {
      console.log('👤 User session update:', session);
      // Refresh active user count
      DatabaseService.getActiveUserCount().then(setActiveUsers);
    });

    setUserSessionSubscription(sessionSubscription);
  }, [metricsSubscription, userSessionSubscription, loadMetrics]);

  const unsubscribeFromMetrics = useCallback(() => {
    console.log('📊 Unsubscribing from real-time metrics');
    
    if (metricsSubscription) {
      metricsSubscription.unsubscribe();
      setMetricsSubscription(null);
    }

    if (userSessionSubscription) {
      userSessionSubscription.unsubscribe();
      setUserSessionSubscription(null);
    }
  }, [metricsSubscription, userSessionSubscription]);

  const sendRealtimeMessage = useCallback((conversationId: string, message: any) => {
    console.log(`📤 Sending real-time message to ${conversationId}:`, message);
    // This would be implemented with Supabase real-time broadcasting
  }, []);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      if (metricsSubscription) {
        metricsSubscription.unsubscribe();
      }
      if (userSessionSubscription) {
        userSessionSubscription.unsubscribe();
      }
    };
  }, [metricsSubscription, userSessionSubscription]);

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      connectionStatus,
      activeUsers,
      systemHealth,
      metrics,
      subscribeToChat,
      unsubscribeFromChat,
      subscribeToMetrics,
      unsubscribeFromMetrics,
      sendRealtimeMessage,
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}