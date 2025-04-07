import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/useAIRecommendations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot, Smile, Gift, ThumbsUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthModals } from './AuthModals';
import { formatDateTime } from '@/lib/types';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const AIRecommendations: React.FC = () => {
  const { messages, loading, sendMessage } = useAIChat();
  const { isAuthenticated } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // GSAP animations
  useEffect(() => {
    if (sectionRef.current && contentRef.current && chatboxRef.current) {
      // Animate section content
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          }
        }
      );

      // Animate chatbox
      gsap.fromTo(
        chatboxRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: {
            trigger: chatboxRef.current,
            start: 'top 75%',
          }
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (inputMessage.trim() && !loading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section id="ai-chat" ref={sectionRef} className="py-16 bg-[hsl(var(--chocolate-cream))] bg-opacity-30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div ref={contentRef} className="md:w-1/2">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-4">
                  AI-Powered Chocolate Recommendations
                </h2>
                <p className="text-[hsl(var(--chocolate-medium))] mb-6">
                  Our AI assistant helps you discover chocolates perfectly matched to your taste preferences, mood, and occasion.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <ThumbsUp className="text-[hsl(var(--chocolate-accent))] mr-2 h-5 w-5" />
                    <span>Personalized flavor recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Smile className="text-[hsl(var(--chocolate-accent))] mr-2 h-5 w-5" />
                    <span>Mood-based chocolate suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <Gift className="text-[hsl(var(--chocolate-accent))] mr-2 h-5 w-5" />
                    <span>Perfect selections for any occasion</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleStartChat}
                  className="bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] text-white font-semibold px-8 py-3 h-12"
                >
                  Start Conversation
                </Button>
              </div>
              
              <div ref={chatboxRef} className="md:w-1/2 bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[hsl(var(--chocolate-accent))] rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Cocoa Assistant</h3>
                    <p className="text-sm text-gray-500">AI Chocolate Expert</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4 h-64 overflow-y-auto p-2">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg py-2 px-4 max-w-xs ${
                          msg.role === 'user' 
                            ? 'bg-[hsl(var(--chocolate-medium))] text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {formatDateTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSubmit} className="flex items-center border-t pt-4">
                  <Input
                    type="text"
                    placeholder="Ask about chocolates..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--chocolate-accent))]"
                    disabled={loading || !isAuthenticated}
                  />
                  <Button 
                    type="submit"
                    className="bg-[hsl(var(--chocolate-accent))] text-white p-2 rounded-r-md h-10"
                    disabled={loading || !isAuthenticated}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Auth Modals */}
      <AuthModals 
        isOpen={isAuthModalOpen}
        type={authType}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitch={(type) => setAuthType(type)}
      />
    </>
  );
};
