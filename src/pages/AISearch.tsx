// src/pages/AISearch.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { api } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Show me all missions',
  'Tell me about CARGO-1',
  'Which missions are delayed?',
  'What is the status of CARGO-2?',
  'Where is CARGO-3 going?',
  'Show me completed missions',
  'Where is the ISS?',
  'Who is in space?',
  'Upcoming SpaceX launches'
];

export default function AISearch() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const health = await api.health();
      setIsConnected(health.status === 'healthy');
    } catch {
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
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(finalQuery);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsConnected(true);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '⚠️ Could not connect to AstroCargo AI backend. Make sure the backend server is running on port 8081.',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" />
            AI-Powered Search
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Ask AstroCargo AI
          </h1>
          <p className="text-gray-400 text-sm">
            Ask about space missions, cargo status, delays, and more...
          </p>
          {isConnected !== null && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {isConnected ? 'Connected to AI' : 'Disconnected from backend'}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800 min-h-[400px] max-h-[500px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">👋 Ask me anything about space missions!</p>
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
            <div className="p-4 space-y-4">
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-2">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400 ml-3" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about space missions... e.g., 'Show me all missions'"
              className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}