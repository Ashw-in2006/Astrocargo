import { motion } from 'framer-motion';
import { Package, Wrench, FlaskConical, Heart, Cpu, Zap, ShieldCheck, MapPin, Clock, User } from 'lucide-react';
import type { EquipmentItem } from '@/data/mockData';

const categoryIcons: Record<string, typeof Package> = {
  Tools: Wrench,
  Consumables: Package,
  Medical: Heart,
  Scientific: FlaskConical,
  Equipment: Cpu,
  Power: Zap,
  Clothing: ShieldCheck,
  'Life Support': ShieldCheck,
};

const statusStyles: Record<string, string> = {
  available: 'status-available',
  in_use: 'status-in-use',
  maintenance: 'status-maintenance',
  damaged: 'status-critical',
  expired: 'status-critical',
};

const statusLabels: Record<string, string> = {
  available: 'Available',
  in_use: 'In Use',
  maintenance: 'Maintenance',
  damaged: 'Damaged',
  expired: 'Expired',
};

const priorityLabels: Record<number, { label: string; class: string }> = {
  1: { label: 'CRITICAL', class: 'text-alert' },
  2: { label: 'HIGH', class: 'text-warning' },
  3: { label: 'MEDIUM', class: 'text-primary' },
  4: { label: 'LOW', class: 'text-muted-foreground' },
};

interface Props {
  item: EquipmentItem;
  onAction?: (action: string, item: EquipmentItem) => void;
}

export default function EquipmentCard({ item, onAction }: Props) {
  const Icon = categoryIcons[item.category] || Package;
  const priority = priorityLabels[item.priorityLevel] || priorityLabels[3];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-card-hover p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{item.name}</h3>
            <p className="text-xs text-muted-foreground">{item.category} · {item.subcategory}</p>
          </div>
        </div>
        <span className={`text-[10px] font-heading font-bold ${priority.class}`}>
          {priority.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{item.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {item.moduleCode} / {item.containerCode}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {item.lastUsed}
        </div>
        {item.assignedAstronaut && (
          <div className="flex items-center gap-1 text-muted-foreground col-span-2">
            <User className="h-3 w-3" />
            {item.assignedAstronaut}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[item.status]}`}>
          {statusLabels[item.status]}
        </span>
        <div className="flex gap-1">
          {['✅', '➡️', '🔧', '⚠️'].map((emoji, i) => (
            <button
              key={i}
              onClick={() => onAction?.(['use', 'move', 'maintain', 'damage'][i], item)}
              className="p-1 rounded hover:bg-muted/50 transition-colors text-xs"
              title={['Mark Used', 'Move', 'Maintenance', 'Report Damaged'][i]}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-muted-foreground">
        SN: {item.serialNumber} · Uses: {item.usageCount} · {item.weightKg}kg
      </div>
    </motion.div>
  );
}
