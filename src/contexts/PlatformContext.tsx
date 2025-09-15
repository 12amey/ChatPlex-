import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { providerManager } from '../lib/providers';
import { DatabaseService, type Agent, type Message, type Conversation } from '../lib/supabase';

export type LLMProvider = 'openai' | 'gemini' | 'anthropic' | 'groq';

interface PlatformContextType {
  agents: Agent[];
  conversations: Conversation[];
  currentProvider: LLMProvider;
  isStreaming: boolean;
  loading: boolean;
  createAgent: (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => void;
  setCurrentProvider: (provider: LLMProvider) => void;
  sendMessage: (agentId: string, content: string) => Promise<void>;
  getConversation: (agentId: string) => Conversation | undefined;
  getConversationMessages: (conversationId: string) => Message[];
  clearConversation: (agentId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

// Generate unique user ID for session tracking
const getUserId = () => {
  let userId = localStorage.getItem('chatplex_user_id');
  if (!userId) {
    userId = `user_${uuidv4()}`;
    localStorage.setItem('chatplex_user_id', userId);
  }
  return userId;
};

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('chatplex_session_id');
  if (!sessionId) {
    sessionId = `session_${uuidv4()}`;
    sessionStorage.setItem('chatplex_session_id', sessionId);
  }
  return sessionId;
};

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});
  const [currentProvider, setCurrentProvider] = useState<LLMProvider>('gemini');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = getUserId();
  const sessionId = getSessionId();

  // Initialize data and user session
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Create default agents if none exist
        const existingAgents = await DatabaseService.getAgents();
        if (existingAgents.length === 0) {
          console.log('Creating default agents...');
          const defaultAgents = [
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
              is_active: true
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
              is_active: true
            }
          ];

          for (const agentData of defaultAgents) {
            try {
              await DatabaseService.createAgent(agentData);
            } catch (error) {
              console.error('Error creating default agent:', error);
            }
          }
        }
        
        // Update user session
        try {
          await DatabaseService.updateUserSession(userId, sessionId);
        } catch (error) {
          console.warn('Could not update user session:', error);
        }
        
        // Load agents
        const agentsData = await DatabaseService.getAgents();
        setAgents(agentsData);
        
        // Load conversations for each agent
        const conversationsData: Conversation[] = [];
        const messagesData: Record<string, Message[]> = {};
        
        for (const agent of agentsData) {
          try {
            const conversation = await DatabaseService.getOrCreateConversation(agent.id, userId);
            conversationsData.push(conversation);
            
            const messages = await DatabaseService.getConversationMessages(conversation.id);
            messagesData[conversation.id] = messages;
          } catch (error) {
            console.error(`Error loading conversation for agent ${agent.id}:`, error);
          }
        }
        
        setConversations(conversationsData);
        setConversationMessages(messagesData);
        
      } catch (error) {
        console.error('Error initializing platform data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Update user session periodically
    const sessionInterval = setInterval(() => {
      DatabaseService.updateUserSession(userId, sessionId);
    }, 30000); // Update every 30 seconds

    // Cleanup inactive sessions periodically
    const cleanupInterval = setInterval(() => {
      DatabaseService.cleanupInactiveSessions();
    }, 60000); // Cleanup every minute

    return () => {
      clearInterval(sessionInterval);
      clearInterval(cleanupInterval);
    };
  }, [userId, sessionId]);

  const refreshData = useCallback(async () => {
    try {
      const agentsData = await DatabaseService.getAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  const createAgent = useCallback(async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAgent = await DatabaseService.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }, []);

  const updateAgent = useCallback(async (id: string, updates: Partial<Agent>) => {
    try {
      const updatedAgent = await DatabaseService.updateAgent(id, updates);
      setAgents(prev => prev.map(agent => 
        agent.id === id ? updatedAgent : agent
      ));
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id));
  }, []);

  const getConversation = useCallback((agentId: string) => {
    return conversations.find(conv => conv.agent_id === agentId);
  }, [conversations]);

  const getConversationMessages = useCallback((conversationId: string) => {
    const messages = conversationMessages[conversationId] || [];
    console.log('Getting messages for conversation:', conversationId, messages);
    return messages;
  }, [conversationMessages]);

  const clearConversation = useCallback(async (agentId: string) => {
    try {
      const conversation = conversations.find(conv => conv.agent_id === agentId);
      if (conversation) {
        await DatabaseService.clearConversation(conversation.id);
        
        // Remove from local state
        setConversations(prev => prev.filter(conv => conv.id !== conversation.id));
        setConversationMessages(prev => {
          const updated = { ...prev };
          delete updated[conversation.id];
          return updated;
        });
        
        // Create new conversation
        const newConversation = await DatabaseService.getOrCreateConversation(agentId, userId);
        setConversations(prev => [...prev, newConversation]);
        setConversationMessages(prev => ({ ...prev, [newConversation.id]: [] }));
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  }, [conversations, userId]);

  const sendMessage = useCallback(async (agentId: string, content: string) => {
    console.log('Sending message to agent:', agentId, 'content:', content);
    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
      console.error('Agent not found:', agentId);
      return;
    }

    try {
      setIsStreaming(true);

      // Get or create conversation
      let conversation = conversations.find(c => c.agent_id === agentId);
      if (!conversation) {
        console.log('Creating new conversation for agent:', agentId);
        conversation = await DatabaseService.getOrCreateConversation(agentId, userId);
        setConversations(prev => [...prev, conversation!]);
        setConversationMessages(prev => ({ ...prev, [conversation!.id]: [] }));
      }
      console.log('Using conversation:', conversation.id);

      // Save user message to database
      const userMessage: Omit<Message, 'id' | 'created_at'> = {
        conversation_id: conversation.id,
        role: 'user',
        content,
        tokens: 0,
        cost: 0,
        latency: 0,
        sentiment: 'neutral',
        metadata: {}
      };

      const savedUserMessage = await DatabaseService.saveMessage(userMessage);
      console.log('Saved user message:', savedUserMessage);
      
      // Update local state
      setConversationMessages(prev => ({
        ...prev,
        [conversation!.id]: [...(prev[conversation!.id] || []), savedUserMessage]
      }));

      // Prepare messages for API call
      const currentMessages = conversationMessages[conversation.id] || [];
      const apiMessages = [...currentMessages, savedUserMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      console.log('API messages:', apiMessages);

      // Record start time for latency calculation
      const startTime = Date.now();
      console.log('Calling LLM provider:', agent.provider);

      // Call the LLM provider
      const response = await providerManager.sendMessage(
        agent.provider as LLMProvider,
        apiMessages,
        {
          model: agent.provider === 'openai' ? 'gpt-4' : 
                 agent.provider === 'gemini' ? 'gemini-1.5-flash' :
                 agent.provider === 'anthropic' ? 'claude-3-sonnet' :
                 'llama2-70b-4096',
          temperature: agent.temperature,
          maxTokens: agent.max_tokens
        }
      );
      console.log('LLM response:', response);

      const endTime = Date.now();
      const latency = (endTime - startTime) / 1000; // Convert to seconds

      const assistantContent = response.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      const tokens = response.usage?.total_tokens || 0;
      const cost = tokens * 0.00002; // Approximate cost calculation

      // Save assistant message to database
      const assistantMessage: Omit<Message, 'id' | 'created_at'> = {
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantContent,
        provider: agent.provider,
        tokens,
        cost,
        latency,
        sentiment: 'neutral', // Could be enhanced with sentiment analysis
        metadata: {
          model: response.model || 'unknown',
          usage: response.usage || {}
        }
      };

      const savedAssistantMessage = await DatabaseService.saveMessage(assistantMessage);
      console.log('Saved assistant message:', savedAssistantMessage);
      
      // Update local state
      setConversationMessages(prev => ({
        ...prev,
        [conversation!.id]: [...(prev[conversation!.id] || []), savedAssistantMessage]
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Save error message to database
      const conversation = conversations.find(c => c.agent_id === agentId);
      if (conversation) {
        const errorMessage: Omit<Message, 'id' | 'created_at'> = {
          conversation_id: conversation.id,
          role: 'assistant',
          content: `I apologize, but I'm having trouble connecting to the ${agent?.provider || 'AI'} service. Please check your API configuration or try switching to a different provider. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          provider: agent.provider,
          tokens: 0,
          cost: 0,
          latency: 0,
          sentiment: 'neutral',
          metadata: { error: true }
        };

        try {
          const savedErrorMessage = await DatabaseService.saveMessage(errorMessage);
          console.log('Saved error message:', savedErrorMessage);
          setConversationMessages(prev => ({
            ...prev,
            [conversation.id]: [...(prev[conversation.id] || []), savedErrorMessage]
          }));
        } catch (saveError) {
          console.error('Error saving error message:', saveError);
        }
      }
    } finally {
      setIsStreaming(false);
    }
  }, [agents, conversations, conversationMessages, userId]);

  return (
    <PlatformContext.Provider value={{
      agents,
      conversations,
      currentProvider,
      isStreaming,
      loading,
      createAgent,
      updateAgent,
      deleteAgent,
      setCurrentProvider,
      sendMessage,
      getConversation,
      getConversationMessages,
      clearConversation,
      refreshData
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}