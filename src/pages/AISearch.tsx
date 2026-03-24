import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, MessageSquare } from 'lucide-react';

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const sampleQueries = [
  'Show me all missions',
  'Tell me about CARGO-1',
  'Which missions are delayed?',
  'What is the status of CARGO-2?',
  'Where is CARGO-3 going?',
  'Show me completed missions',
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [connected, setConnected] = useState<boolean | null>(null);

  // Check backend connection on mount - FIXED: using useEffect instead of useState
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setConnected(data.status === 'healthy');
    } catch (error) {
      setConnected(false);
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    if (searchQuery) setQuery(searchQuery);
    setSearching(true);
    setAiResponse('');

    try {
      // Call REAL backend AI
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: finalQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || data.response || "I'm not sure how to answer that.";
      
      setAiResponse(reply);
      
    } catch (error) {
      console.error('AI Search Error:', error);
      setAiResponse(`⚠️ Could not connect to AI backend at ${API_URL}. Make sure the backend server is running.`);
    } finally {
      setSearching(false);
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
          {connected !== null && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
              {connected ? 'Connected to AI' : 'Disconnected from backend'}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-2 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400 ml-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ask about space missions... e.g., 'Show me all missions'"
              className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
              disabled={searching || !query.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </div>

        {/* Sample queries */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {sampleQueries.map(q => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="px-3 py-1.5 rounded-full text-xs bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all border border-gray-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Loading */}
        {searching && (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 text-cyan-400 mx-auto mb-3 animate-spin" />
            <p className="text-sm text-gray-400">AI is thinking...</p>
          </div>
        )}

        {/* Results */}
        {aiResponse && !searching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-xs text-gray-500">
              AI Response for: "{query}"
            </p>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-2 text-cyan-400">AstroCargo AI</p>
                  <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}