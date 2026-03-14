import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Package } from 'lucide-react';
import SpaceNav from '@/components/SpaceNav';
import EquipmentCard from '@/components/EquipmentCard';
import { equipmentItems } from '@/data/mockData';
import { toast } from 'sonner';

const categories = ['All', 'Tools', 'Consumables', 'Medical', 'Scientific', 'Equipment', 'Power', 'Clothing', 'Life Support'];
const statuses = ['All', 'available', 'in_use', 'maintenance', 'damaged'];
const moduleFilters = ['All', 'HAB-01', 'LAB-01', 'STR-01', 'NODE-01'];

export default function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filtered = useMemo(() => {
    return equipmentItems.filter(item => {
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || item.category === category;
      const matchStatus = status === 'All' || item.status === status;
      const matchModule = moduleFilter === 'All' || item.moduleCode === moduleFilter;
      return matchSearch && matchCat && matchStatus && matchModule;
    });
  }, [search, category, status, moduleFilter]);

  const handleAction = (action: string, item: typeof equipmentItems[0]) => {
    const actionLabels: Record<string, string> = {
      use: 'Marked as Used',
      move: 'Move initiated',
      maintain: 'Sent to Maintenance',
      damage: 'Reported Damaged',
    };
    toast.success(`${actionLabels[action]}: ${item.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Equipment Registry
          </h1>
          <p className="text-muted-foreground text-sm">{filtered.length} items · {equipmentItems.length} total</p>
        </motion.div>

        {/* Search */}
        <div className="glass-card p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search equipment by name, serial number, or description..."
              className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    category === c ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                    status === s ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {s === 'All' ? 'All Status' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {moduleFilters.map(m => (
                <button
                  key={m}
                  onClick={() => setModuleFilter(m)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                    moduleFilter === m ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {m === 'All' ? 'All Modules' : m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <EquipmentCard key={item.id} item={item} onAction={handleAction} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-heading text-sm">No equipment found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
