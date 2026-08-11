import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Cpu, FolderGit2, Building2, Briefcase, Network, ArrowRight, Zap, GitFork } from 'lucide-react';
import { HealthService, DeveloperService } from '../services/api';
import Spinner, { CardSkeleton } from '../components/Common/LoadingState';
import ErrorState from '../components/Common/ErrorState';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, devRes] = await Promise.all([
        HealthService.getStats(),
        DeveloperService.getAll()
      ]);
      setStats(statsRes.data);
      setDevelopers(devRes.data || []);
      if (devRes.data && devRes.data.length > 0) {
        setSelectedDeveloper(devRes.data[0].name);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the graph database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CardSkeleton count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const statCards = [
    { title: 'Developers', count: stats?.nodes?.Person || 32, icon: Users, color: 'from-blue-500/20 to-indigo-500/20', textColor: 'text-blue-400', link: '/developers' },
    { title: 'Skills Catalog', count: stats?.nodes?.Skill || 25, icon: Cpu, color: 'from-emerald-500/20 to-teal-500/20', textColor: 'text-emerald-400', link: '/skills' },
    { title: 'Projects Built', count: stats?.nodes?.Project || 18, icon: FolderGit2, color: 'from-amber-500/20 to-orange-500/20', textColor: 'text-amber-400', link: '/developers' },
    { title: 'Companies Hiring', count: stats?.nodes?.Company || 12, icon: Building2, color: 'from-purple-500/20 to-pink-500/20', textColor: 'text-purple-400', link: '/jobs' },
    { title: 'Job Roles', count: stats?.nodes?.JobRole || 22, icon: Briefcase, color: 'from-rose-500/20 to-red-500/20', textColor: 'text-rose-400', link: '/jobs' }
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Header Section */}
      <div className="relative glass-panel p-8 sm:p-12 rounded-3xl border border-brand-500/30 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5" />
            <span>Powered by CognoDB & Neo4j Bolt</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            SkillGraph — Graph-Powered Career & Skill Explorer
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Discover how engineers, technical skills, production projects, companies, and career job opportunities connect through real-time multi-hop graph traversals.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              onClick={() => navigate(c.link)}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${c.color} ${c.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">{c.count}</p>
              <p className="text-xs font-medium text-slate-400">{c.title}</p>
            </div>
          );
        })}
      </div>

      {/* Explore Career Graph Section */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Explore the Career Graph
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select a developer profile to run real-time Cypher multi-hop traversals, job matching scores, and skill gap discovery.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm font-medium focus:outline-none focus:border-brand-500"
            >
              {developers.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.role})
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate(`/developers?selected=${encodeURIComponent(selectedDeveloper)}`)}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center gap-2 whitespace-nowrap"
            >
              Analyze Profile
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">2+ Hop Skill Matching</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Traverses <code className="text-brand-300">Person → Skill ← JobRole</code> relationships to compute instant skill compatibility percentages without expensive SQL JOINs.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Instant Skill Gap Analysis</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uses Cypher graph pattern matching to isolate exact missing technical capabilities for candidate career transitions.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Multi-Hop Traversals</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Discovers 3-hop relationships connecting candidates to companies: <code className="text-brand-300">Person → Skill ← JobRole ← Company</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
