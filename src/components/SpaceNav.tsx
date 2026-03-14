import { Link, useLocation } from 'react-router-dom';
import { Rocket, LayoutDashboard, Package, Globe, BarChart3, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: Rocket },
  { path: '/dashboard', label: 'Mission Control', icon: LayoutDashboard },
  { path: '/equipment', label: 'Equipment', icon: Package },
  { path: '/orbital', label: 'Orbital Map', icon: Globe },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/search', label: 'AI Search', icon: Search },
];

export default function SpaceNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-bold neon-text">OrbitOps</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary neon-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs font-mono text-success">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto scrollbar-space">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
