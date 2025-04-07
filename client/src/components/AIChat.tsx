import React, { useState, useEffect, useRef } from "react";
import { useAIChat } from "@/hooks/useAIRecommendations";
import { useAuth } from "@/hooks/useAuth";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gsap } from "gsap";
import { formatDateTime } from "@/lib/types";
import { AuthModals } from "./AuthModals";

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  
  const { messages, loading, sendMessage } = useAIChat();
  const { isAuthenticated } = useAuth();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);
  
  // Add button pulse animation
  useEffect(() => {
    if (buttonRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(buttonRef.current, { 
        scale: 1.1, 
        boxShadow: "0 0 15px rgba(198, 160, 61, 0.5)",
        duration: 0.8,
        ease: "power1.inOut"
      });
      tl.to(buttonRef.current, { 
        scale: 1, 
        boxShadow: "0 0 10px rgba(198, 160, 61, 0)",
        duration: 0.8,
        ease: "power1.inOut"
      });
      
      return () => {
        tl.kill();
      };
    }
  }, []);

  // Handle chat toggle
  const toggleChat = () => {
    if (!isOpen && !isAuthenticated) {
      setAuthType('login');
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsOpen(!isOpen);
    
    if (!isOpen && chatContainerRef.current) {
      // Open animation
      gsap.fromTo(
        chatContainerRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  // Handle message submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() && !loading) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          ref={buttonRef}
          onClick={toggleChat}
          className="bg-[hsl(var(--chocolate-accent))] hover:bg-opacity-90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-white rounded-lg shadow-xl border overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-[hsl(var(--chocolate-dark))] text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[hsl(var(--chocolate-accent))] rounded-full flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Cocoa Assistant</h3>
                <p className="text-xs opacity-80">AI Chocolate Expert</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-[hsl(var(--chocolate-medium))]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg py-2 px-4 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-[hsl(var(--chocolate-medium))] text-white"
                        : "bg-white border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDateTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start mt-4">
                <div className="bg-white border rounded-lg py-2 px-4 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about chocolates..."
                className="flex-1 border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-[hsl(var(--chocolate-accent))] hover:bg-opacity-90 text-white rounded-l-none"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModals
        isOpen={isAuthModalOpen}
        type={authType}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitch={(type) => setAuthType(type)}
      />
    </>
  );
};
