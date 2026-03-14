import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import SpaceNav from '@/components/SpaceNav';
import { usageTrendData, moduleCapacityData, categoryDistribution } from '@/data/mockData';

const depletionData = [
  { day: 'Day 1', food: 100, oxygen: 100, water: 100, batteries: 100 },
  { day: 'Day 5', food: 85, oxygen: 92, water: 88, batteries: 95 },
  { day: 'Day 10', food: 68, oxygen: 84, water: 76, batteries: 88 },
  { day: 'Day 15', food: 52, oxygen: 76, water: 65, batteries: 80 },
  { day: 'Day 20', food: 35, oxygen: 68, water: 54, batteries: 72 },
  { day: 'Day 25', food: 20, oxygen: 60, water: 42, batteries: 65 },
  { day: 'Day 30', food: 8, oxygen: 52, water: 30, batteries: 58 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs border border-primary/20">
      <p className="font-mono text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-1 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Equipment usage trends, supply forecasts, and operational insights</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Usage Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Equipment Usage Trends
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={usageTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#B0BEC5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#B0BEC5' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="tools" stroke="#00E5FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="consumables" stroke="#FF6D00" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medical" stroke="#FF4081" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="scientific" stroke="#7C4DFF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Module Capacity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Module Capacity Utilization
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moduleCapacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#B0BEC5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#B0BEC5' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="used" name="Used (kg)" radius={[4, 4, 0, 0]}>
                  {moduleCapacityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="capacity" name="Capacity (kg)" fill="hsl(222 30% 18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Supply Depletion */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-alert" />
              Supply Depletion Forecast
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={depletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#B0BEC5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#B0BEC5' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="food" stroke="#FF6D00" fill="#FF6D00" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="oxygen" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="water" stroke="#2979FF" fill="#2979FF" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="batteries" stroke="#7C4DFF" fill="#7C4DFF" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-accent" />
              Equipment by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={{ stroke: '#B0BEC5' }}
                >
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
