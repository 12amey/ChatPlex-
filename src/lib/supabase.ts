import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types matching our schema
export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  provider: string;
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  tools: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  tokens: number;
  cost: number;
  latency: number;
  sentiment: string;
  metadata: any;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  title?: string;
  started_at: string;
  last_message_at: string;
  total_messages: number;
  total_tokens: number;
  total_cost: number;
  sentiment: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  metric_type: string;
  value: number;
  metadata: any;
  recorded_at: string;
}

export interface ProviderUsage {
  id: string;
  provider: string;
  requests: number;
  tokens: number;
  cost: number;
  errors: number;
  avg_latency: number;
  date: string;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_id: string;
  last_seen: string;
  is_active: boolean;
  metadata: any;
  created_at: string;
}

// Real-time subscription helpers
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, 
      (payload) => callback(payload.new as Message)
    )
    .subscribe();
};

export const subscribeToAgentStatus = (callback: (agent: Agent) => void) => {
  return supabase
    .channel('agents')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'agents'
      }, 
      (payload) => callback(payload.new as Agent)
    )
    .subscribe();
};

export const subscribeToAnalytics = (callback: (analytics: Analytics) => void) => {
  return supabase
    .channel('analytics')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'analytics'
      }, 
      (payload) => callback(payload.new as Analytics)
    )
    .subscribe();
};

export const subscribeToUserSessions = (callback: (session: UserSession) => void) => {
  return supabase
    .channel('user_sessions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_sessions'
      }, 
      (payload) => callback(payload.new as UserSession)
    )
    .subscribe();
};

// Database operations
export class DatabaseService {
  // Agent operations
  static async getAgents(): Promise<Agent[]> {
    // For demo purposes, return mock agents from localStorage
    const storedAgents = JSON.parse(localStorage.getItem('demo_agents') || '[]');
    
    if (storedAgents.length === 0) {
      // Return default agents if none exist
      const defaultAgents: Agent[] = [
        {
          id: 'travel-agent',
          name: 'Travel Assistant',
          description: 'Expert travel planner with access to tours and destinations',
          avatar: '✈️',
          provider: 'gemini',
          system_prompt: 'You are a helpful travel assistant with access to tour information and travel recommendations.',
          temperature: 0.7,
          max_tokens: 2000,
          tools: ['contentstack', 'booking-api'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'support-agent',
          name: 'Support Agent',
          description: 'Technical support specialist for API and SDK issues',
          avatar: '🛠️',
          provider: 'gemini',
          system_prompt: 'You are a technical support specialist helping developers with API integration and troubleshooting.',
          temperature: 0.3,
          max_tokens: 1500,
          tools: ['documentation', 'code-analysis'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      localStorage.setItem('demo_agents', JSON.stringify(defaultAgents));
      return defaultAgents;
    }
    
    return storedAgents.filter((agent: Agent) => agent.is_active);
  }

  static async createAgent(agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>): Promise<Agent> {
    // For demo purposes, create mock agents with predefined IDs
    const mockAgent: Agent = {
      id: (agent as any).id || `agent_${Date.now()}`,
      ...agent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in localStorage for demo
    const existingAgents = JSON.parse(localStorage.getItem('demo_agents') || '[]');
    const updatedAgents = [...existingAgents, mockAgent];
    localStorage.setItem('demo_agents', JSON.stringify(updatedAgents));
    
    return mockAgent;
  }

  static async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Conversation operations
  static async getOrCreateConversation(agentId: string, userId: string = 'anonymous'): Promise<Conversation> {
    // For demo purposes, use localStorage
    const conversationKey = `conversation_${agentId}_${userId}`;
    const existingConversation = localStorage.getItem(conversationKey);
    
    if (existingConversation) {
      return JSON.parse(existingConversation);
    }
    
    // Create new conversation
    const newConversation: Conversation = {
      id: `conv_${agentId}_${Date.now()}`,
      agent_id: agentId,
      user_id: userId,
      title: 'Chat with Agent',
      started_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      total_messages: 0,
      total_tokens: 0,
      total_cost: 0,
      sentiment: 'neutral',
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(conversationKey, JSON.stringify(newConversation));
    return newConversation;
  }

  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    // For demo purposes, use localStorage
    const messagesKey = `messages_${conversationId}`;
    const messages = localStorage.getItem(messagesKey);
    return messages ? JSON.parse(messages) : [];
  }

  static async saveMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    // For demo purposes, use localStorage
    const savedMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...message,
      created_at: new Date().toISOString()
    };
    
    const messagesKey = `messages_${message.conversation_id}`;
    const existingMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
    const updatedMessages = [...existingMessages, savedMessage];
    localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));
    
    return savedMessage;
  }

  static async clearConversation(conversationId: string): Promise<void> {
    // For demo purposes, clear from localStorage
    const messagesKey = `messages_${conversationId}`;
    localStorage.removeItem(messagesKey);
    
    // Find and remove conversation
    const allKeys = Object.keys(localStorage);
    const conversationKey = allKeys.find(key => 
      key.startsWith('conversation_') && localStorage.getItem(key)?.includes(conversationId)
    );
    
    if (conversationKey) {
      localStorage.removeItem(conversationKey);
    }
  }

  // Analytics operations
  static async getRealTimeMetrics(): Promise<any> {
    // Mock real-time metrics for now
    return {
      messages_per_second: Math.floor(Math.random() * 10) + 5,
      active_conversations: Math.floor(Math.random() * 50) + 20,
      average_latency: Math.random() * 2 + 0.5,
      error_rate: Math.random() * 0.05,
      total_messages_today: Math.floor(Math.random() * 10000) + 5000,
      total_cost_today: Math.random() * 100 + 50,
      active_users: Math.floor(Math.random() * 100) + 50
    };
  }

  static async getProviderUsage(days: number = 30): Promise<ProviderUsage[]> {
    const { data, error } = await supabase
      .from('provider_usage')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getUsageAnalytics(days: number = 30): Promise<any[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // User session management
  static async updateUserSession(userId: string, sessionId: string): Promise<void> {
    await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        last_seen: new Date().toISOString(),
        is_active: true
      });
  }

  static async getActiveUserCount(): Promise<number> {
    const { count, error } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    
    if (error) throw error;
    return count || 0;
  }

  // Cleanup function
  static async cleanupInactiveSessions(): Promise<void> {
    await supabase.rpc('cleanup_inactive_sessions');
  }
}