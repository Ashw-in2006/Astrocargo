import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Package, AlertTriangle, Cloud, Users, Activity, 
  Clock, MapPin, CheckCircle, XCircle, Rocket, Calendar 
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { modules, activityLogs, aiAlerts, equipmentItems } from '@/data/mockData';
import SpaceNav from '@/components/SpaceNav';
import { api, Mission } from '@/lib/api';
import { AIChat } from '@/components/AIChat';

export default function Dashboard() {
  // Existing state for your dashboard
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  
  // Existing stats from your mock data
  const available = equipmentItems.filter(e => e.status === 'available').length;
  const inUse = equipmentItems.filter(e => e.status === 'in_use').length;
  const maintenance = equipmentItems.filter(e => e.status === 'maintenance').length;
  const damaged = equipmentItems.filter(e => e.status === 'damaged').length;

  // Load missions from backend
  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await api.getMissions();
      setMissions(data);
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setLoadingMissions(false);
    }
  };

  const getMissionStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delayed': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in transit': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-muted-foreground text-sm font-mono">Station Time: {new Date().toUTCString()}</p>
        </motion.div>

        {/* Stats - Your existing cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <StatCard label="Active Modules" value={modules.length} icon={Box} variant="primary" />
          <StatCard label="Total Equipment" value={equipmentItems.length} icon={Package} variant="default" />
          <StatCard label="AI Alerts" value={aiAlerts.filter(a => !a.resolved).length} icon={AlertTriangle} variant="alert" />
          <StatCard label="Cloud Status" value="Online" icon={Cloud} variant="success" />
          <StatCard label="Crew Onboard" value={5} icon={Users} variant="primary" />
        </div>

        {/* NEW: AI Chat Section - Integrated here */}
        <div className="mb-8">
          <AIChat />
        </div>

        {/* Main Grid - Your existing layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Your existing equipment and module status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Status Overview */}
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

            {/* Module Status - Your existing module cards */}
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

            {/* NEW: Space Cargo Missions Section */}
            <div className="glass-card p-5">
              <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-cyan-400" />
                Active Space Cargo Missions
              </h2>
              
              {loadingMissions ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                  <p className="text-muted-foreground mt-2 text-sm">Loading missions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      onClick={() => setSelectedMission(mission)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] hover:border-cyan-400/50 ${getMissionStatusColor(mission.status)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">{mission.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{mission.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMissionStatusColor(mission.status)} border`}>
                          {mission.status}
                        </span>
                      </div>
                      
                      {mission.destination && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{mission.destination}</span>
                        </div>
                      )}
                      
                      {mission.delay_reason && (
                        <div className="mt-2 text-xs text-yellow-400 bg-yellow-400/10 p-1.5 rounded">
                          ⚠️ {mission.delay_reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Your existing AI Alerts and Activity Feed */}
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

      {/* Mission Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedMission(null)}>
          <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">{selectedMission.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Mission ID</span>
                <span className="text-white font-mono text-sm">{selectedMission.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMissionStatusColor(selectedMission.status)} border`}>
                  {selectedMission.status}
                </span>
              </div>
              {selectedMission.destination && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Destination</span>
                  <span className="text-white text-sm">{selectedMission.destination}</span>
                </div>
              )}
              {selectedMission.launch_date && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Launch Date</span>
                  <span className="text-white text-sm">{selectedMission.launch_date}</span>
                </div>
              )}
              {selectedMission.delay_reason && (
                <div className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <span className="text-yellow-400 text-xs">Delay Reason:</span>
                  <p className="text-white text-sm mt-1">{selectedMission.delay_reason}</p>
                </div>
              )}
              {selectedMission.cargo && selectedMission.cargo.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-400 text-sm">Cargo Manifest:</span>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedMission.cargo.map((item, i) => (
                      <li key={i} className="text-white text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedMission(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}