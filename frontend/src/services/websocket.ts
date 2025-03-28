// services/websocket.ts
type MessageHandler = (data: any) => void;

const getWebSocketBaseUrl = () => {
  // For Create React App
  if (import.meta.env?.VITE_WEBSOCKET_URL) {
    return import.meta.env.VITE_WEBSOCKET_URL;
  }

  // For environment variables in modern setups
  if (import.meta.env?.REACT_APP_WEBSOCKET_URL) {
    return import.meta.env.REACT_APP_WEBSOCKET_URL;
  }

  // Default development URL
  return "ws://127.0.0.1:8000";
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;
  private baseUrl = getWebSocketBaseUrl();
  private connectTimeoutId: number | null = null;

  connect(documentId: string, delay = 500) {
    if (this.isConnecting) return;

    this.isConnecting = true;

    // Clear any existing connection timeout
    if (this.connectTimeoutId !== null) {
      window.clearTimeout(this.connectTimeoutId);
    }

    // Add a small delay before the first connection attempt
    this.connectTimeoutId = window.setTimeout(() => {
      this.connectTimeoutId = null;
      this.establishConnection(documentId);
    }, delay);
  }

  private establishConnection(documentId: string) {
    // Proper URL construction
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMTIxNTQ0LCJpYXQiOjE3NDMxMTc5NDQsImp0aSI6IjMwZWFjOTgyNDg5ZDRkZDE5NmYwYzRhZDllZjI4N2MyIiwidXNlcl9pZCI6MX0.s9cA7aBDiYXc1z2c492iSaHNCU-7mr2yQ-3coMSKl5M";
    const url = new URL(`/ws/document/${documentId}/`, this.baseUrl);
    url.searchParams.set("token", token);

    console.log("Connecting to WebSocket:", url.toString());

    // Close existing socket if it exists
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    try {
      this.socket = new WebSocket(url.toString());

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(data));
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket disconnected", event);
        this.isConnecting = false;
        // Only attempt to reconnect if this wasn't a normal closure
        if (event.code !== 1000) {
          this.attemptReconnect(documentId);
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        // Explicitly close the socket on error to trigger the onclose handler
        if (this.socket) {
          this.socket.close();
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.isConnecting = false;
      this.attemptReconnect(documentId);
    }
  }

  private attemptReconnect(documentId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        1000 * Math.pow(2, this.reconnectAttempts - 1),
        30000
      ); // Exponential backoff with 30s max
      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (!this.isConnecting) {
          this.connect(documentId, 0); // No delay for reconnection attempts
        }
      }, delay);
    } else {
      console.warn(
        `Maximum reconnection attempts (${this.maxReconnectAttempts}) reached.`
      );
    }
  }

  send(message: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message - WebSocket not connected");
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  disconnect() {
    if (this.connectTimeoutId !== null) {
      window.clearTimeout(this.connectTimeoutId);
      this.connectTimeoutId = null;
    }

    if (this.socket) {
      this.socket.close(1000); // Normal closure
      this.socket = null;
    }
    this.messageHandlers = [];
    this.isConnecting = false;
  }

  get status() {
    return this.socket?.readyState;
  }
}

export const websocketService = new WebSocketService();
