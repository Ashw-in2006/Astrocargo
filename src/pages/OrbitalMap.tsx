import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Info, X } from 'lucide-react';
import Starfield from '@/components/Starfield';
import SpaceNav from '@/components/SpaceNav';

interface SatelliteInfo {
  name: string;
  altitude: string;
  displaySpeed: string;
  orbit: string;
  status: string;
  nextPass: string;
}

interface SatelliteData extends SatelliteInfo {
  orbitRadius: number;
  orbitSpeed: number;
  inclination: number;
  startAngle: number;
}

const satellites: SatelliteData[] = [
  { name: 'OrbitOps-SAT-01', altitude: '412 km', displaySpeed: '7.66 km/s', orbit: 'LEO', status: 'Active', nextPass: '47 min', orbitRadius: 3.2, orbitSpeed: 0.4, inclination: 0.4, startAngle: 0 },
  { name: 'OrbitOps-SAT-02', altitude: '420 km', displaySpeed: '7.65 km/s', orbit: 'LEO', status: 'Active', nextPass: '92 min', orbitRadius: 3.3, orbitSpeed: 0.35, inclination: 0.8, startAngle: Math.PI / 3 },
  { name: 'OrbitOps-CARGO-01', altitude: '405 km', displaySpeed: '7.67 km/s', orbit: 'LEO', status: 'Docking', nextPass: '12 min', orbitRadius: 3.1, orbitSpeed: 0.45, inclination: 0.3, startAngle: Math.PI },
  { name: 'COMSAT-Alpha', altitude: '35,786 km', displaySpeed: '3.07 km/s', orbit: 'GEO', status: 'Active', nextPass: 'N/A', orbitRadius: 5.5, orbitSpeed: 0.1, inclination: 0.05, startAngle: Math.PI / 2 },
  { name: 'NAV-SAT-03', altitude: '20,200 km', displaySpeed: '3.87 km/s', orbit: 'MEO', status: 'Active', nextPass: '180 min', orbitRadius: 4.5, orbitSpeed: 0.2, inclination: 0.9, startAngle: Math.PI * 1.5 },
  { name: 'SCI-OBS-07', altitude: '600 km', displaySpeed: '7.56 km/s', orbit: 'LEO', status: 'Active', nextPass: '65 min', orbitRadius: 3.5, orbitSpeed: 0.38, inclination: 1.4, startAngle: Math.PI * 0.7 },
];

function OrbitingSatellite({ sat, onClick }: { sat: typeof satellites[0]; onClick: (s: SatelliteInfo) => void }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * sat.orbitSpeed + sat.startAngle;
    ref.current.position.x = Math.cos(t) * sat.orbitRadius;
    ref.current.position.z = Math.sin(t) * sat.orbitRadius * Math.cos(sat.inclination);
    ref.current.position.y = Math.sin(t) * sat.orbitRadius * Math.sin(sat.inclination);
  });

  return (
    <>
      {/* Orbit path */}
      <mesh rotation={[sat.inclination, 0, 0]}>
        <torusGeometry args={[sat.orbitRadius, 0.005, 8, 128]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.15} />
      </mesh>
      {/* Satellite dot */}
      <mesh ref={ref} onClick={() => onClick(sat)}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={sat.status === 'Docking' ? '#FF6D00' : '#00E5FF'} />
      </mesh>
    </>
  );
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
      <Sphere ref={ref} args={[2, 64, 64]}>
        <meshStandardMaterial color="#1a4a7a" emissive="#0a2a4a" emissiveIntensity={0.3} roughness={0.8} />
      </Sphere>
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.06} side={THREE.BackSide} />
      </Sphere>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
    </group>
  );
}

export default function OrbitalMap() {
  const [selected, setSelected] = useState<SatelliteInfo | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SpaceNav />
      <div className="pt-16 h-screen flex flex-col">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Satellite className="h-6 w-6 text-primary" />
            Live Orbital Map
          </h1>
          <p className="text-xs text-muted-foreground font-mono">{satellites.length} objects tracked · Real-time simulation</p>
        </div>

        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 3, 10], fov: 45 }}>
            <Suspense fallback={null}>
              <Starfield count={3000} />
              <Earth />
              {satellites.map((sat, i) => (
                <OrbitingSatellite key={i} sat={sat} onClick={setSelected} />
              ))}
              <OrbitControls enablePan={false} minDistance={5} maxDistance={20} />
            </Suspense>
          </Canvas>

          {/* Info panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-4 right-4 w-72 glass-card p-5 border border-primary/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Satellite className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-sm font-bold">{selected.name}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    ['Altitude', selected.altitude],
                    ['Speed', selected.displaySpeed],
                    ['Orbit', selected.orbit],
                    ['Status', selected.status],
                    ['Next Pass', selected.nextPass],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className={v === 'Active' ? 'text-success' : v === 'Docking' ? 'text-warning' : 'text-foreground'}>{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card p-3 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Active satellite</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">Docking/Approach</span>
            </div>
            <p className="text-muted-foreground/50 pt-1">Click any satellite for details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
