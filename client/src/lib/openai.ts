import { apiRequest } from "./queryClient";
import type { Product, ProductRecommendation } from "@shared/schema";

interface RecommendationParams {
  preferences?: string;
  mood?: string;
  occasion?: string;
}

interface RecommendationResponse {
  recommendations: ProductRecommendation[];
}

/**
 * Get AI-powered product recommendations based on user preferences, mood, or occasion
 */
export const getProductRecommendations = async (
  params: RecommendationParams
): Promise<ProductRecommendation[]> => {
  try {
    const response = await apiRequest("POST", "/api/recommend", params);
    const data: RecommendationResponse = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error("Error getting product recommendations:", error);
    throw error;
  }
};

/**
 * Setup and manage WebSocket connection for the AI chatbot
 */
export class ChatClient {
  private ws: WebSocket | null = null;
  private messageHandler: ((message: any) => void) | null = null;
  private errorHandler: ((error: any) => void) | null = null;
  private userId: string | null = null;

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    // Use secure WebSocket if on HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // Use the specific path for chat WebSocket to avoid conflicts with Vite's HMR
    this.ws = new WebSocket(`${protocol}//${host}/api/ws/chat`);

    this.ws.onopen = () => {
      console.log('ChatClient: WebSocket connection established');
      
      // Re-authenticate if we have a userId and the connection is open
      if (this.userId && this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log(`ChatClient: Re-authenticating user ${this.userId}`);
        // Send a ping message to maintain the connection
        this.ws.send(JSON.stringify({
          userId: this.userId,
          type: 'ping',
          content: 'ping' // Add a dummy content to match expected format
        }));
      }
    };

    this.ws.onmessage = (event) => {
      try {
        console.log('ChatClient: Message received');
        const data = JSON.parse(event.data);
        if (this.messageHandler) {
          this.messageHandler(data);
        }
      } catch (error) {
        console.error('ChatClient: Error parsing WebSocket message:', error);
        if (this.errorHandler) {
          this.errorHandler(error);
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('ChatClient: WebSocket error:', error);
      if (this.errorHandler) {
        this.errorHandler(error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`ChatClient: WebSocket connection closed with code ${event.code}`);
      
      // Only reconnect if it was an abnormal closure
      if (event.code !== 1000 && event.code !== 1001) {
        console.log('ChatClient: Attempting to reconnect in 3 seconds...');
        setTimeout(() => this.initWebSocket(), 3000);
      }
    };
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public setMessageHandler(handler: (message: any) => void) {
    this.messageHandler = handler;
  }

  public setErrorHandler(handler: (error: any) => void) {
    this.errorHandler = handler;
  }

  public sendMessage(content: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection is not open');
    }

    if (!this.userId) {
      throw new Error('User ID is not set');
    }

    this.ws.send(JSON.stringify({
      userId: this.userId,
      content
    }));
  }

  public close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Singleton instance for chat client
export const chatClient = new ChatClient();
