// Real-time API client with WebSocket and HTTP fallback
class APIClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1', apiKey: string = import.meta.env.VITE_OPENAI_API_KEY || 'demo-key') {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // OpenAI Chat Completions
  async createChatCompletion(messages: any[], model: string = 'gpt-4', temperature: number = 0.7) {
    return this.request('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: false
      }),
    });
  }

  // Streaming chat completion
  async createStreamingChatCompletion(messages: any[], model: string = 'gpt-4', temperature: number = 0.7) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  // Chat APIs
  async createConversation(agentId: string, userId: string = 'demo-user') {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ agentId, userId }),
    });
  }

  async sendMessage(conversationId: string, content: string, provider?: string) {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, provider }),
    });
  }

  // Streaming chat with Server-Sent Events
  createChatStream(conversationId: string, message: string, provider?: string): EventSource {
    const params = new URLSearchParams({
      conversationId,
      message,
      ...(provider && { provider }),
    });

    return new EventSource(`${this.baseURL}/chat/stream?${params}`);
  }

  // Agent Management
  async getAgents() {
    return this.request('/agents');
  }

  async createAgent(agent: any) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    });
  }

  async updateAgent(agentId: string, updates: any) {
    return this.request(`/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAgent(agentId: string) {
    return this.request(`/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Knowledge & RAG
  async indexContent(content: any) {
    return this.request('/knowledge/index', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async searchKnowledge(query: string, limit: number = 10) {
    return this.request(`/knowledge/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Analytics
  async getMetrics(timeRange: string = '24h') {
    return this.request(`/analytics/metrics?range=${timeRange}`);
  }

  async getConversationAnalytics(conversationId: string) {
    return this.request(`/analytics/conversations/${conversationId}`);
  }

  // Provider Management
  async getProviders() {
    return this.request('/providers');
  }

  async switchProvider(agentId: string, provider: string) {
    return this.request('/providers/switch', {
      method: 'POST',
      body: JSON.stringify({ agentId, provider }),
    });
  }

  async getProviderStatus() {
    return this.request('/providers/status');
  }

  // Translation & AI Services
  async translateText(text: string, targetLanguage: string) {
    return this.request('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLanguage }),
    });
  }

  async analyzeSentiment(text: string) {
    return this.request('/ai/sentiment', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async summarizeConversation(conversationId: string) {
    return this.request(`/ai/summarize/${conversationId}`, {
      method: 'POST',
    });
  }

  // Real-time subscriptions
  subscribeToRealTimeUpdates(callback: (data: any) => void) {
    const eventSource = new EventSource(`${this.baseURL}/realtime/subscribe`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Failed to parse real-time data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Real-time connection error:', error);
    };

    return eventSource;
  }
}

export const apiClient = new APIClient();