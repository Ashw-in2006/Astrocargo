import { motion } from 'framer-motion';
import { Box, Package, AlertTriangle, Cloud, Users, Activity, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { modules, activityLogs, aiAlerts, equipmentItems } from '@/data/mockData';
import SpaceNav from '@/components/SpaceNav';

export default function Dashboard() {
  const available = equipmentItems.filter(e => e.status === 'available').length;
  const inUse = equipmentItems.filter(e => e.status === 'in_use').length;
  const maintenance = equipmentItems.filter(e => e.status === 'maintenance').length;
  const damaged = equipmentItems.filter(e => e.status === 'damaged').length;

  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-1">Mission Control</h1>
          <p className="text-muted-foreground text-sm font-mono">Station Time: {new Date().toUTCString()}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <StatCard label="Active Modules" value={modules.length} icon={Box} variant="primary" />
          <StatCard label="Total Equipment" value={equipmentItems.length} icon={Package} variant="default" />
          <StatCard label="AI Alerts" value={aiAlerts.filter(a => !a.resolved).length} icon={AlertTriangle} variant="alert" />
          <StatCard label="Cloud Status" value="Online" icon={Cloud} variant="success" />
          <StatCard label="Crew Onboard" value={5} icon={Users} variant="primary" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Equipment Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-5">
              <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Equipment Status Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Available', count: available, cls: 'status-available' },
                  { label: 'In Use', count: inUse, cls: 'status-in-use' },
                  { label: 'Maintenance', count: maintenance, cls: 'status-maintenance' },
                  { label: 'Damaged', count: damaged, cls: 'status-critical' },
                ].map(s => (
                  <div key={s.label} className={`rounded-lg p-4 text-center ${s.cls}`}>
                    <p className="text-2xl font-heading font-bold">{s.count}</p>
                    <p className="text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Status */}
            <div className="glass-card p-5">
              <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                Module Status
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {modules.map(m => {
                  const pct = Math.round((m.currentWeightKg / m.weightCapacityKg) * 100);
                  return (
                    <div key={m.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-semibold text-sm">{m.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{m.code}</p>
                        </div>
                        <span className="text-xs font-mono text-primary">{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${pct > 80 ? 'bg-alert' : pct > 60 ? 'bg-warning' : 'bg-primary'}`}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {m.currentWeightKg}kg / {m.weightCapacityKg}kg · {m.volumeCubicMeters}m³
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* AI Alerts */}
            <div className="glass-card p-5">
              <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-alert" />
                AI Alerts
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-space">
                {aiAlerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`p-3 rounded-lg border ${
                      alert.resolved ? 'bg-muted/20 border-border opacity-60' :
                      alert.severity === 'critical' ? 'bg-alert/10 border-alert/30' :
                      alert.severity === 'high' ? 'bg-warning/10 border-warning/30' :
                      'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-semibold">{alert.title}</p>
                      {alert.resolved ? (
                        <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-alert shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">{alert.timestamp}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-card p-5">
              <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-space">
                {activityLogs.map(log => (
                  <div key={log.id} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                      <div className="w-px h-full bg-border" />
                    </div>
                    <div className="pb-3">
                      <p className="font-medium">{log.astronaut}</p>
                      <p className="text-muted-foreground">
                        {log.action} <span className="text-foreground">{log.equipment}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-muted-foreground/60">
                        <MapPin className="h-3 w-3" />
                        {log.module}
                        <Clock className="h-3 w-3 ml-1" />
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
