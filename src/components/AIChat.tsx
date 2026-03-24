import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export function AIChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check backend connection
    api.health().then(data => {
      setConnected(data.status === 'healthy');
    }).catch(() => setConnected(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setResponse('');
    
    try {
      const reply = await api.chat(message);
      setResponse(reply);
    } catch (error) {
      setResponse('Error: Could not get response from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-cyan-400">AstroCargo AI Assistant</h2>
        {connected ? (
          <span className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">● Connected</span>
        ) : (
          <span className="ml-auto text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">● Disconnected</span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about space missions (e.g., 'Show me CARGO-1', 'Which missions are delayed?')"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div className="bg-gray-800/50 rounded-lg p-4 mt-4 border border-gray-700">
          <div className="text-cyan-400 text-xs mb-2 font-mono">AI Response:</div>
          <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{response}</div>
        </div>
      )}
    </div>
  );
}