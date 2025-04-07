import React, { useState, useEffect, useRef } from "react";
import { useAIChat } from "@/hooks/useAIRecommendations";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  AlertTriangle,
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

interface AIChatProps {
  floatingAnimation?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ floatingAnimation = false }) => {
  const [location] = useLocation();
  const isHomePage = location === "/" || floatingAnimation;
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [apiError, setApiError] = useState<{show: boolean, message: string, isQuotaError: boolean}>({
    show: false,
    message: '',
    isQuotaError: false
  });
  
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
  
  // Add button pulse animation for non-homepage chat button
  useEffect(() => {
    if (buttonRef.current && !isHomePage) {
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
  }, [isHomePage]);
  
  // Listen for error messages from WebSocket client
  useEffect(() => {
    // Setup event listener for custom event from chat client
    const handleChatError = (event: CustomEvent) => {
      const { error, errorCode } = event.detail;
      
      if (error) {
        setApiError({
          show: true,
          message: error,
          isQuotaError: errorCode === 'quota_exceeded'
        });
      }
    };
    
    // Add event listener
    document.addEventListener('chat:error' as any, handleChatError as EventListener);
    
    // Cleanup
    return () => {
      document.removeEventListener('chat:error' as any, handleChatError as EventListener);
    };
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

  // Use different animation for home page's chat button
  useEffect(() => {
    if (buttonRef.current && isHomePage && !isOpen) {
      // Clear any existing animations
      gsap.killTweensOf(buttonRef.current);
      
      // Create floating animation for home page
      const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
      
      floatTl
        .to(buttonRef.current, {
          y: -15,
          duration: 2,
          ease: "sine.inOut",
          boxShadow: "0 15px 25px rgba(198, 160, 61, 0.4)",
          scale: 1.05
        })
        .to(buttonRef.current, {
          y: 0,
          duration: 2, 
          ease: "sine.inOut",
          boxShadow: "0 5px 15px rgba(198, 160, 61, 0.2)",
          scale: 1
        });
      
      return () => {
        floatTl.kill();
      };
    }
  }, [isHomePage, isOpen]);

  return (
    <>
      {/* Chat Button */}
      <div className={`fixed ${isHomePage ? 'bottom-16 right-8' : 'bottom-6 right-6'} z-40 transition-all duration-500`}>
        <Button
          ref={buttonRef}
          onClick={toggleChat}
          className={`
            ${isHomePage 
              ? 'bg-gradient-to-br from-[hsl(var(--chocolate-accent))] to-[hsl(var(--chocolate-dark))]' 
              : 'bg-[hsl(var(--chocolate-accent))]'
            } 
            hover:bg-opacity-90 text-white 
            rounded-full ${isHomePage ? 'w-18 h-18' : 'w-16 h-16'} flex items-center justify-center 
            ${isHomePage 
              ? 'shadow-xl shadow-[rgba(198,160,61,0.3)]' 
              : 'shadow-lg'
            }
            ${isHomePage && !isOpen ? 'animate-float' : ''}
            relative overflow-hidden before:absolute before:inset-0 before:rounded-full
            ${isHomePage ? 'before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:opacity-20 before:animate-shimmer' : ''}
          `}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              {isHomePage ? (
                <div className="relative flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-white z-10 animate-glow-pulse" />
                  <div className="absolute inset-0 bg-white opacity-0 rounded-full animate-ping-slow"></div>
                </div>
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </>
          )}
        </Button>
      </div>
      
      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className={`fixed ${isHomePage ? 'bottom-36 right-8' : 'bottom-24 right-6'} z-40 w-full max-w-sm bg-white rounded-lg 
            ${isHomePage 
              ? 'border border-[hsl(var(--chocolate-accent))] shadow-2xl shadow-[rgba(198,160,61,0.15)]' 
              : 'border shadow-xl'
            } 
            overflow-hidden transition-all duration-500
          `}
        >
          {/* Chat Header */}
          <div className={`
            ${isHomePage 
              ? 'bg-gradient-to-r from-[hsl(var(--chocolate-dark))] via-[hsl(var(--chocolate-medium))] to-[hsl(var(--chocolate-dark))]' 
              : 'bg-[hsl(var(--chocolate-dark))]'
            } 
            text-white p-4 flex items-center justify-between relative overflow-hidden
          `}>
            {/* Background shine effect for home page */}
            {isHomePage && (
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                <div className="absolute -left-[100%] top-0 bottom-0 w-[60%] rotate-[30deg] bg-gradient-to-r from-transparent via-white to-transparent animate-slide-right-slow"></div>
              </div>
            )}
            
            <div className="flex items-center relative z-10">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mr-3
                ${isHomePage 
                  ? 'bg-gradient-to-br from-[hsl(var(--chocolate-accent))] to-[hsl(var(--chocolate-light))] shadow-md shadow-[rgba(198,160,61,0.3)]' 
                  : 'bg-[hsl(var(--chocolate-accent))]'
                }
              `}>
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
              className="text-white hover:bg-[hsl(var(--chocolate-medium))] relative z-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className={`h-80 overflow-y-auto p-4 ${isHomePage ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-gray-50'}`}>
            {/* Error Banner - smaller and less intrusive */}
            {apiError.show && (
              <div className={`mb-4 p-2 rounded-lg text-white ${apiError.isQuotaError ? 'bg-amber-600/70' : 'bg-red-500/70'}`}>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-xs">{apiError.isQuotaError ? 'AI Service Limit Reached' : 'Service Unavailable'}</p>
                    <p className="text-xs opacity-90 mt-0.5">Using fallback responses for now</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto -mr-2 -mt-1 text-white hover:bg-white hover:bg-opacity-20 h-6 w-6"
                    onClick={() => setApiError({...apiError, show: false})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      rounded-lg py-2 px-4 max-w-[85%] 
                      ${msg.role === "user"
                        ? isHomePage
                          ? "bg-gradient-to-r from-[hsl(var(--chocolate-dark))] to-[hsl(var(--chocolate-medium))] text-white shadow-md"
                          : "bg-[hsl(var(--chocolate-medium))] text-white"
                        : isHomePage
                          ? "bg-white border border-gray-200 shadow-sm"
                          : "bg-white border"
                      }
                    `}
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
          <form onSubmit={handleSubmit} className={`p-4 border-t ${isHomePage ? 'bg-gray-50' : ''}`}>
            <div className={`flex ${isHomePage ? 'shadow-sm rounded-md overflow-hidden' : ''}`}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isHomePage ? "Ask our chocolate expert..." : "Ask about chocolates..."}
                className={`
                  flex-1 border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0
                  ${isHomePage ? 'border-[hsl(var(--chocolate-accent))] border-opacity-30 focus:border-opacity-70' : ''}
                `}
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className={`
                  text-white rounded-l-none
                  ${isHomePage 
                    ? 'bg-gradient-to-r from-[hsl(var(--chocolate-accent))] to-[hsl(var(--chocolate-dark))] hover:opacity-95' 
                    : 'bg-[hsl(var(--chocolate-accent))] hover:bg-opacity-90'
                  }
                `}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isHomePage && (
              <p className="text-xs text-center mt-2 text-gray-500 italic">
                Powered by AI to answer all your chocolate questions
              </p>
            )}
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
