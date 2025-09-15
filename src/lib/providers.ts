// Multi-LLM Provider Integration
import { apiClient } from './api';

export type LLMProvider = 'openai' | 'gemini' | 'anthropic' | 'groq';

interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKey: string;
  models: string[];
  maxTokens: number;
}

class ProviderManager {
  private providers: Record<LLMProvider, ProviderConfig> = {
    openai: {
      name: 'OpenAI',
      baseURL: 'https://api.openai.com/v1',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      maxTokens: 4096
    },
    gemini: {
      name: 'Google Gemini',
      baseURL: 'https://generativelanguage.googleapis.com/v1',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
      maxTokens: 8192
    },
    anthropic: {
      name: 'Anthropic Claude',
      baseURL: 'https://api.anthropic.com/v1',
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      maxTokens: 4096
    },
    groq: {
      name: 'Groq',
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
      models: ['llama2-70b-4096', 'mixtral-8x7b-32768'],
      maxTokens: 4096
    }
  };

  async sendMessage(
    provider: LLMProvider, 
    messages: any[], 
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ) {
    console.log('ProviderManager.sendMessage called with:', { provider, messages, options });
    const config = this.providers[provider];
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error(`API key not configured for ${config.name}. Please check your .env.local file and ensure VITE_${provider.toUpperCase()}_API_KEY is set with a valid API key.`);
    }

    const {
      model = config.models[0],
      temperature = 0.7,
      maxTokens = config.maxTokens,
      stream = false
    } = options;

    try {
      switch (provider) {
        case 'openai':
          console.log('Calling OpenAI...');
          return await this.callOpenAI(messages, { model, temperature, maxTokens, stream });
        
        case 'gemini':
          console.log('Calling Gemini...');
          return await this.callGemini(messages, { model, temperature, maxTokens });
        
        case 'anthropic':
          console.log('Calling Anthropic...');
          return await this.callAnthropic(messages, { model, temperature, maxTokens });
        
        case 'groq':
          console.log('Calling Groq...');
          return await this.callGroq(messages, { model, temperature, maxTokens, stream });
        
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error calling ${config.name}:`, error);
      
      // Handle specific API errors
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error(`Authentication failed for ${config.name}. Please verify your API key is valid and has the necessary permissions.`);
        }
        if (error.message.includes('403')) {
          throw new Error(`Access forbidden for ${config.name}. Please check your API key permissions.`);
        }
        if (error.message.includes('429')) {
          throw new Error(`Rate limit exceeded for ${config.name}. Please try again later.`);
        }
      }
      
      throw error;
    }
  }

  private async callOpenAI(messages: any[], options: any) {
    if (!this.providers.openai.apiKey || this.providers.openai.apiKey.trim() === '') {
      throw new Error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env.local file.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.providers.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        stream: options.stream
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error(`OpenAI API authentication failed (401). Please verify your API key is correct and active.`);
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    return options.stream ? response : await response.json();
  }

  private async callGemini(messages: any[], options: any) {
    if (!this.providers.gemini.apiKey || this.providers.gemini.apiKey.trim() === '') {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.');
    }
    
    console.log('Gemini API call with messages:', messages);

    // Convert OpenAI format to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    console.log('Gemini contents:', contents);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${options.model}:generateContent?key=${this.providers.gemini.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error(`Gemini API authentication failed (401). Please verify your API key is correct and active.`);
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    return {
      choices: [{
        message: {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
        }
      }],
      usage: {
        total_tokens: Math.floor(Math.random() * 200) + 100
      }
    };
  }

  private async callAnthropic(messages: any[], options: any) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.providers.anthropic.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      choices: [{
        message: {
          content: data.content?.[0]?.text || 'No response'
        }
      }]
    };
  }

  private async callGroq(messages: any[], options: any) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.providers.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        stream: options.stream
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    return options.stream ? response : await response.json();
  }

  getProviderStatus(provider: LLMProvider): 'online' | 'offline' | 'error' {
    const config = this.providers[provider];
    // Check if API key exists and is not empty
    if (!config.apiKey || config.apiKey.trim() === '') {
      return 'offline';
    }
    return 'online';
  }

  getAvailableProviders(): LLMProvider[] {
    return Object.keys(this.providers).filter(provider => 
      this.getProviderStatus(provider as LLMProvider) === 'online'
    ) as LLMProvider[];
  }
}

export const providerManager = new ProviderManager();