interface WebSocketConfig {
  baseUrl: string;
  maxReconnectAttempts: number;
  initialConnectionDelay: number;
  reconnectionDelayFactor: number;
  maxReconnectionDelay: number;
}

type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private isConnecting = false;
  private connectTimeoutId: number | null = null;
  private currentResourceId: string | null = null; // To track what we are connected to
  private readonly config: Required<WebSocketConfig>;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      baseUrl: "ws://text-editor-production-6731.up.railway.app/",
      maxReconnectAttempts: 5,
      initialConnectionDelay: 500,
      reconnectionDelayFactor: 2,
      maxReconnectionDelay: 30000,
      ...config,
    };
  }

  public connectOwner(documentId: string): void {
    this.currentResourceId = documentId;
    this.attemptConnectionWithDelay(
      this.buildOwnerWebSocketUrl(documentId),
      this.config.initialConnectionDelay
    );
  }

  public connectGuest(sharedId: string): void {
    this.currentResourceId = `${sharedId}`;
    this.attemptConnectionWithDelay(
      this.buildGuestWebSocketUrl(sharedId),
      this.config.initialConnectionDelay
    );
  }

  public send(message: object): void {
    if (this.isConnected) {
      this.socket!.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message - WebSocket is not open.");
    }
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public disconnect(): void {
    this.clearConnectionTimeout();
    this.closeSocket(1000);
    this.resetConnectionState();
    this.currentResourceId = null;
  }

  public get status(): number | undefined {
    return this.socket?.readyState;
  }

  private attemptConnectionWithDelay(url: URL, delay: number): void {
    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.clearConnectionTimeout();

    this.connectTimeoutId = window.setTimeout(() => {
      this.connectTimeoutId = null;
      this.establishConnection(url);
    }, delay);
  }

  private establishConnection(url: URL): void {
    this.closeSocket();

    try {
      console.log("Connecting to WebSocket:", url.toString());

      this.socket = new WebSocket(url.toString());
      this.setupSocketEventHandlers();
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.isConnecting = false;
      if (this.currentResourceId) {
        this.reconnect(this.currentResourceId);
      }
    }
  }

  private buildOwnerWebSocketUrl(documentId: string): URL {
    const url = new URL(`/ws/document/${documentId}/`, this.config.baseUrl);
    const token = this.getAuthToken();
    url.searchParams.set("token", token);
    return url;
  }

  private buildGuestWebSocketUrl(sharedId: string): URL {
    return new URL(`/ws/document/shared/${sharedId}/`, this.config.baseUrl);
  }

  private getAuthToken(): string {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!tokenCookie) {
      console.warn("Auth token not found in cookies");
      return "";
    }

    return tokenCookie.substring(6);
  }

  private setupSocketEventHandlers(): void {
    if (!this.socket) {
      return;
    }

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.resetReconnectionAttempts();
      this.isConnecting = false;
      // Consider emitting a 'connected' event if needed
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected", event);
      this.isConnecting = false;
      if (!event.wasClean && this.currentResourceId) {
        this.reconnect(this.currentResourceId);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isConnecting = false;
      this.closeSocket();
    };
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      this.messageHandlers.forEach((handler) => handler(data));
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }

  private reconnect(resourceId: string): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        this.config.initialConnectionDelay *
          Math.pow(
            this.config.reconnectionDelayFactor,
            this.reconnectAttempts - 1
          ),
        this.config.maxReconnectionDelay
      );

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (!this.isConnecting && this.currentResourceId === resourceId) {
          const url = resourceId.startsWith("guest/")
            ? this.buildGuestWebSocketUrl(resourceId.substring(6))
            : this.buildOwnerWebSocketUrl(resourceId);
          this.attemptConnectionWithDelay(url, 0);
        }
      }, delay);
    } else {
      console.warn(
        `Maximum reconnection attempts (${this.config.maxReconnectAttempts}) reached for ${resourceId}.`
      );
      // Consider emitting a 'reconnectFailed' event if needed
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectTimeoutId !== null) {
      window.clearTimeout(this.connectTimeoutId);
      this.connectTimeoutId = null;
    }
  }

  private closeSocket(code: number = 1000, reason?: string): void {
    if (this.socket) {
      this.socket.close(code, reason);
      this.socket = null;
    }
  }

  private resetConnectionState(): void {
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  private resetReconnectionAttempts(): void {
    this.reconnectAttempts = 0;
  }

  private get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
