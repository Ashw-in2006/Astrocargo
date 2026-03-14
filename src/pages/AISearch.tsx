import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, Clock, Tag, Zap } from 'lucide-react';
import SpaceNav from '@/components/SpaceNav';
import { equipmentItems } from '@/data/mockData';

const sampleQueries = [
  'Where is the oxygen repair kit?',
  'Show all tools in LAB-01',
  'Find critical priority items',
  'List damaged equipment',
  'What medical supplies are available?',
  'Items with high usage count',
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return equipmentItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.moduleCode.toLowerCase().includes(q) ||
      item.containerCode.toLowerCase().includes(q) ||
      item.status.includes(q) ||
      (q.includes('critical') && item.priorityLevel === 1) ||
      (q.includes('damaged') && item.status === 'damaged') ||
      (q.includes('maintenance') && item.status === 'maintenance') ||
      (q.includes('medical') && item.category === 'Medical') ||
      (q.includes('tool') && item.category === 'Tools') ||
      (q.includes('available') && item.status === 'available')
    );
  }, [query]);

  const doSearch = (q?: string) => {
    if (q) setQuery(q);
    setSearching(true);
    setHasSearched(false);
    setTimeout(() => {
      setSearching(false);
      setHasSearched(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" />
            AI-Powered Search
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Find Any Equipment</h1>
          <p className="text-muted-foreground text-sm">Ask naturally — "Where is the oxygen repair kit?" or "Show damaged items in HAB-01"</p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-2 mb-4 neon-glow">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary ml-3" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setHasSearched(false); }}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Ask me anything about equipment..."
              className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <button
              onClick={() => doSearch()}
              className="gradient-primary px-5 py-2 rounded-lg text-sm font-heading font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              Search
            </button>
          </div>
        </motion.div>

        {/* Sample queries */}
        {!hasSearched && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {sampleQueries.map(q => (
              <button
                key={q}
                onClick={() => { setQuery(q); doSearch(q); }}
                className="px-3 py-1.5 rounded-full text-xs bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-transparent hover:border-border"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {searching && (
          <div className="text-center py-10">
            <Zap className="h-8 w-8 text-primary mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-muted-foreground font-mono">Processing query...</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {hasSearched && !searching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs text-muted-foreground font-mono">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {results.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card-hover p-4 flex items-center gap-4"
                >
                  <div className={`p-2 rounded-lg ${
                    item.status === 'available' ? 'bg-success/10 text-success' :
                    item.status === 'in_use' ? 'bg-warning/10 text-warning' :
                    item.status === 'damaged' ? 'bg-alert/10 text-alert' :
                    'bg-accent/10 text-accent'
                  }`}>
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.moduleCode} / {item.containerCode}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.lastUsed}</span>
                      <span>SN: {item.serialNumber}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                    item.status === 'available' ? 'status-available' :
                    item.status === 'in_use' ? 'status-in-use' :
                    item.status === 'damaged' ? 'status-critical' :
                    'status-maintenance'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </motion.div>
              ))}
              {results.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-sm">No results found. Try a different query.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
