import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Package, Search, Globe, BarChart3, Shield } from 'lucide-react';
import Starfield from '@/components/Starfield';
import EarthModel from '@/components/EarthModel';
import { Suspense } from 'react';

const features = [
  { icon: Package, title: 'Cargo Tracking', desc: 'Real-time monitoring of every tool, supply, and instrument across all spacecraft modules.' },
  { icon: Search, title: 'AI Search', desc: 'Natural language queries powered by AI to locate any equipment instantly.' },
  { icon: Globe, title: 'Orbital Map', desc: 'Live 3D visualization of satellites, stations, and cargo vehicles in orbit.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Predictive analytics for supply depletion, maintenance scheduling, and anomaly detection.' },
  { icon: Shield, title: 'Smart Alerts', desc: 'AI-driven alerts for shortages, anomalies, and critical maintenance needs.' },
  { icon: Rocket, title: 'Mission Control', desc: 'Comprehensive dashboard for engineers to monitor all space operations.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Starfield count={4000} />
            <EarthModel />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/20 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-black mb-4 tracking-tight">
              <span className="neon-text">Orbit</span>
              <span className="text-foreground">Ops</span>
            </h1>
          </motion.div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            AI-Powered Space Cargo Monitoring & Orchestration Platform
          </p>
          <p className="text-sm text-muted-foreground/60 mb-10 font-mono">
            Real-time equipment tracking · Predictive analytics · Mission control
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-20">
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-primary px-8 py-3 rounded-xl font-heading text-sm font-bold text-primary-foreground neon-glow transition-all"
              >
                Launch Mission Control
              </motion.button>
            </Link>
            <Link to="/equipment">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-3 rounded-xl font-heading text-sm font-bold text-foreground hover:border-primary/40 transition-all"
              >
                View Equipment
              </motion.button>
            </Link>
            <Link to="/search">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-3 rounded-xl font-heading text-sm font-bold text-foreground hover:border-accent/40 transition-all"
              >
                AI Search
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto pb-20 w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <f.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading text-sm font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
