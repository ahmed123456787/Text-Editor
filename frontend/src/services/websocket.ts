type MessageHandler = (data: any) => void;

interface WebSocketConfig {
  baseUrl: string;
  maxReconnectAttempts: number;
  initialConnectionDelay: number;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private isConnecting = false;
  private connectTimeoutId: number | null = null;
  private config: WebSocketConfig;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      baseUrl: "ws://127.0.0.1:8000",
      maxReconnectAttempts: 5,
      initialConnectionDelay: 500,
      ...config,
    };
  }

  connect(
    documentId: string,
    delay = this.config.initialConnectionDelay
  ): void {
    if (this.isConnecting) return;

    this.isConnecting = true;
    this.clearConnectionTimeout();

    this.connectTimeoutId = window.setTimeout(() => {
      this.connectTimeoutId = null;
      this.establishConnection(documentId);
    }, delay);
  }

  send(message: object): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message - WebSocket not connected");
    }
  }

  addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  disconnect(): void {
    this.clearConnectionTimeout();

    if (this.socket) {
      this.socket.close(1000);
      this.socket = null;
    }
    this.messageHandlers = [];
    this.isConnecting = false;
  }

  get status(): number | undefined {
    return this.socket?.readyState;
  }

  private establishConnection(documentId: string): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    try {
      const url = this.buildWebSocketUrl(documentId);
      console.log("Connecting to WebSocket:", url.toString());

      this.socket = new WebSocket(url.toString());
      this.setupSocketEventHandlers(documentId);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.isConnecting = false;
      this.attemptReconnect(documentId);
    }
  }

  private buildWebSocketUrl(documentId: string): URL {
    const url = new URL(`/ws/document/${documentId}/`, this.config.baseUrl);
    const token = this.getAuthToken();
    url.searchParams.set("token", token);
    return url;
  }

  private getAuthToken(): string {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjA0NjE0LCJpYXQiOjE3NDM2MDEwMTQsImp0aSI6IjM4MjkwMzdmNDczZTQxNjY4NDQ2YWExMjQ0YmVlOGIxIiwidXNlcl9pZCI6MX0.DUlV00cCVZrY2R3iVzd_pUlilJj02ihoUe8NySNchjo";
  }

  private setupSocketEventHandlers(documentId: string): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected", event);
      this.isConnecting = false;
      if (event.code !== 1000) {
        this.attemptReconnect(documentId);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isConnecting = false;
      if (this.socket) {
        this.socket.close();
      }
    };
  }

  private attemptReconnect(documentId: string): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        1000 * Math.pow(2, this.reconnectAttempts - 1),
        30000
      );

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (!this.isConnecting) {
          this.connect(documentId, 0);
        }
      }, delay);
    } else {
      console.warn(
        `Maximum reconnection attempts (${this.config.maxReconnectAttempts}) reached.`
      );
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectTimeoutId !== null) {
      window.clearTimeout(this.connectTimeoutId);
      this.connectTimeoutId = null;
    }
  }
}

export const websocketService = new WebSocketService();
