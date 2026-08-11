import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Network, LayoutDashboard, Users, Briefcase, Cpu, Share2, Database } from 'lucide-react';
import { HealthService } from '../../services/api';

export const Navbar = () => {
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await HealthService.getHealth();
        if (isMounted) {
          if (res.database === 'ok') setDbStatus('online');
          else setDbStatus('error');
        }
      } catch (err) {
        if (isMounted) setDbStatus('error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/developers', label: 'Developers', icon: Users },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/skills', label: 'Skills', icon: Cpu },
    { to: '/graph', label: 'Graph Explorer', icon: Share2 }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Branding */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-brand-600/20 text-brand-400 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-all shadow-md shadow-brand-500/20">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
                SkillGraph
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                CognoDB
              </span>
            </div>
          </NavLink>

          {/* Main Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Database Connection Indicator */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-slate-400 font-medium">CognoDB:</span>
            {dbStatus === 'online' && (
              <span className="flex items-center text-emerald-400 font-semibold gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Connected
              </span>
            )}
            {dbStatus === 'checking' && (
              <span className="text-amber-400 animate-pulse">Connecting...</span>
            )}
            {dbStatus === 'error' && (
              <span className="text-rose-400 font-medium">Offline</span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
