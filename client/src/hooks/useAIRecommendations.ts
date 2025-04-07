import { useState, useEffect } from 'react';
import { getProductRecommendations, chatClient } from '@/lib/openai';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import type { Product, ProductRecommendation, Message } from '@shared/schema';
import type { ChatMessage } from '@/lib/types';

export const useAIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get recommendations based on parameters
  const getRecommendations = async (params: {
    preferences?: string;
    mood?: string;
    occasion?: string;
  }) => {
    setLoading(true);
    
    try {
      const recs = await getProductRecommendations(params);
      setRecommendations(recs);
      
      // Fetch the actual product data for the recommended products
      const productIds = recs.map(rec => rec.productId);
      const productPromises = productIds.map(id => 
        apiRequest('GET', `/api/products/${id}`)
          .then(res => res.json())
      );
      
      const products = await Promise.all(productPromises);
      setRecommendedProducts(products);
      
      return { recommendations: recs, products };
    } catch (error: any) {
      // Only show toast for non-quota errors (quota errors are shown in the components)
      if (!(error?.message?.includes('quota') || 
            error?.code === 'insufficient_quota' || 
            (error?.error && error.error.type === 'insufficient_quota'))) {
        toast({
          title: 'Recommendation Error',
          description: 'Could not get personalized recommendations at this time',
          variant: 'destructive',
        });
      }
      
      // Let the error propagate so the component can show its error UI
      // but don't show a toast for quota errors
      return { recommendations: [], products: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recommendations,
    recommendedProducts,
    getRecommendations
  };
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Set up chat client on component mount and when user changes
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setInitializing(false);
      return;
    }
    
    // Set user ID for chat client
    chatClient.setUserId(user.uid);
    
    // Load chat history
    const loadChatHistory = async () => {
      try {
        setInitializing(true);
        const response = await apiRequest('GET', `/api/chat/${user.uid}`);
        const data = await response.json();
        
        if (data.messages?.length) {
          const chatMessages = data.messages.map((msg: Message) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }));
          
          setMessages(chatMessages);
        } else {
          // Add initial greeting if no history
          setMessages([{
            role: 'assistant',
            content: 'Hello! I\'m your Cocoa Assistant. I can help you find the perfect chocolates based on your preferences, mood, or occasion. How can I assist you today?',
            timestamp: Date.now()
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast({
          title: 'Chat Error',
          description: 'Could not load your chat history',
          variant: 'destructive',
        });
      } finally {
        setInitializing(false);
      }
    };
    
    loadChatHistory();
    
    // Set up message handler for websocket
    chatClient.setMessageHandler((data) => {
      if (data.message) {
        setMessages(prevMessages => [...prevMessages, data.message]);
        setLoading(false);
      }
      
      if (data.error) {
        // Only show toast for non-quota errors since quota errors are shown in the components
        if (data.errorCode !== 'quota_exceeded') {
          toast({
            title: 'Chat Error',
            description: data.error,
            variant: 'destructive',
          });
        }
        setLoading(false);
      }
    });
    
    chatClient.setErrorHandler((error) => {
      toast({
        title: 'Connection Error',
        description: 'Lost connection to chat service',
        variant: 'destructive',
      });
      setLoading(false);
    });
    
    return () => {
      // Clean up is handled by the chatClient singleton
    };
  }, [user, toast]);

  // Send message
  const sendMessage = (content: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to use the AI assistant',
        variant: 'destructive',
      });
      return;
    }
    
    if (!content.trim()) return;
    
    // Add user message to state immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Send message through WebSocket
      chatClient.sendMessage(content);
    } catch (error) {
      toast({
        title: 'Chat Error',
        description: 'Could not send your message',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    initializing,
    sendMessage
  };
};
