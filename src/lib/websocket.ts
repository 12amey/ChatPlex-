import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string = 'ws://localhost:3001') {
    if (this.socket?.connected) return this.socket;

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('🔗 WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.handleReconnect();
    });

    return this.socket;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, delay);
    }
  }

  // Chat-specific methods
  joinChatRoom(conversationId: string) {
    this.socket?.emit('join_chat', { conversationId });
  }

  leaveChatRoom(conversationId: string) {
    this.socket?.emit('leave_chat', { conversationId });
  }

  sendMessage(conversationId: string, message: any) {
    this.socket?.emit('send_message', { conversationId, message });
  }

  onMessageReceived(callback: (data: any) => void) {
    this.socket?.on('message_received', callback);
  }

  onTypingStart(callback: (data: any) => void) {
    this.socket?.on('typing_start', callback);
  }

  onTypingStop(callback: (data: any) => void) {
    this.socket?.on('typing_stop', callback);
  }

  onAgentStatusChange(callback: (data: any) => void) {
    this.socket?.on('agent_status_change', callback);
  }

  // Provider switching
  onProviderSwitch(callback: (data: any) => void) {
    this.socket?.on('provider_switched', callback);
  }

  switchProvider(agentId: string, provider: string) {
    this.socket?.emit('switch_provider', { agentId, provider });
  }

  // Real-time analytics
  onMetricsUpdate(callback: (data: any) => void) {
    this.socket?.on('metrics_update', callback);
  }

  subscribeToMetrics() {
    this.socket?.emit('subscribe_metrics');
  }

  unsubscribeFromMetrics() {
    this.socket?.emit('unsubscribe_metrics');
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsManager = new WebSocketManager();