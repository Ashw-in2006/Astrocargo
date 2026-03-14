import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'alert';
}

const variantStyles = {
  default: 'border-glass-border',
  primary: 'border-primary/30',
  success: 'border-success/30',
  warning: 'border-warning/30',
  alert: 'border-alert/30',
};

const iconVariants = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  alert: 'text-alert',
};

export default function StatCard({ label, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-card p-5 ${variantStyles[variant]} transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-heading font-bold">{value}</p>
          {trend && (
            <p className="text-xs text-success mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-muted/50 ${iconVariants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
