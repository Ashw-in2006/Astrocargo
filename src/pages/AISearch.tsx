// src/pages/AISearch.tsx - UPDATED with persistence
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, MessageSquare, Wifi, WifiOff, Send } from 'lucide-react';
import { api } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;  // Allow both Date and string
}

const suggestedQuestions = [
  "Show me all missions",
  "Tell me about CARGO-1",
  "Which missions are delayed?",
  "What is the status of CARGO-2?",
  "Where is CARGO-3 going?",
  "Show me completed missions",
  "Where is the ISS?",
  "Who is in space?",
  "Upcoming SpaceX launches"
];

// Key for localStorage
const STORAGE_KEY = 'astrocargo_chat_history';

export default function AISearch() {
  // Load messages from localStorage on startup
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp
        }));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
        return [];
      }
    }
    return [];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const health = await api.health();
      const isHealthy = health.status === 'healthy';
      setIsConnected(isHealthy);
      
      // ONLY add welcome message if no messages exist AND not already added
      if (isHealthy && messages.length === 0 && !hasWelcomeMessage) {
        setHasWelcomeMessage(true);
        const welcomeMsg = {
          role: 'assistant' as const,
          content: "👋 Hello! I'm AstroCargo AI, your space logistics assistant. I can help you with:\n\n• Space cargo missions and status\n• Real-time ISS location tracking\n• Astronauts currently in space\n• Upcoming SpaceX launches\n• Cargo priority calculations\n\nWhat would you like to know?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    }
  };

  const handleSend = async (question?: string) => {
    const finalQuery = question || input;
    if (!finalQuery.trim()) return;

    if (question) setInput('');

    const userMessage: Message = {
      role: 'user',
      content: finalQuery,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(finalQuery);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsConnected(true);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error: Could not connect to AstroCargo AI. Please check if the backend is running on port 8081.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
      if (!question) setInput('');
    }
  };

  // Clear chat history
  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      setHasWelcomeMessage(false);
      // Re-add welcome message
      const welcomeMsg = {
        role: 'assistant' as const,
        content: "👋 Hello! I'm AstroCargo AI, your space logistics assistant. I can help you with:\n\n• Space cargo missions and status\n• Real-time ISS location tracking\n• Astronauts currently in space\n• Upcoming SpaceX launches\n• Cargo priority calculations\n\nWhat would you like to know?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
      setHasWelcomeMessage(true);
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Search className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI-Powered Search</h1>
                <p className="text-sm text-gray-400">Ask about space missions, cargo status, delays, and more...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Clear Chat Button */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition"
                >
                  Clear Chat
                </button>
              )}
              <div className="flex items-center gap-2">
                {isConnected === true ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">Connected to AI</span>
                  </>
                ) : isConnected === false ? (
                  <>
                    <WifiOff className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-red-400">Disconnected</span>
                  </>
                ) : (
                  <Loader2 className="h-3 w-3 text-gray-400 animate-spin" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">👋 Welcome! Ask me anything about space missions.</p>
                <p className="text-gray-600 text-sm mt-2">Try asking about missions, ISS location, astronauts, or launches</p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 rounded-full text-xs bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition border border-gray-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-800 text-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                      <div className="text-[10px] mt-1 opacity-50">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4 bg-gray-900/80">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about space missions... e.g., 'Show me all missions'"
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 transition"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}