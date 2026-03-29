// src/components/AIChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { api } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const health = await api.health();
      const isHealthy = health.status === 'healthy';
      setIsConnected(isHealthy);
      
      // Add welcome message if first time connected
      if (isHealthy && messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: "👋 Hello! I'm AstroCargo AI, your space logistics assistant. I can help you with:\n\n• Space cargo missions and status\n• Real-time ISS location tracking\n• Astronauts currently in space\n• Upcoming SpaceX launches\n• Cargo priority calculations\n\nWhat would you like to know?",
            timestamp: new Date()
          }
        ]);
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

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: finalQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(finalQuery);
      
      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Check connection after successful response
      setIsConnected(true);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error: Could not connect to AstroCargo AI. Please check if the backend is running on port 8081.\n\nMake sure:\n1. Backend is running: `uvicorn main:app --reload --port 8081`\n2. No other service is using port 8081\n3. Check backend console for errors',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
      if (!question) setInput('');
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-800 p-4 bg-gray-900/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="font-semibold text-white">Ask AstroCargo AI</h2>
          </div>
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
        <p className="text-xs text-gray-500 mt-1">Ask about space missions, cargo status, delays, and more...</p>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">👋 Welcome! Ask me anything about space missions.</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
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
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  <div className="text-[10px] mt-1 opacity-50">
                    {msg.timestamp.toLocaleTimeString()}
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

      {/* Input */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/80">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about space missions... e.g., 'Show me all missions'"
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};