import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Cpu, Users, FolderGit2, Briefcase, Building2, Search, Tag } from 'lucide-react';
import { SkillService } from '../services/api';
import Spinner, { CardSkeleton } from '../components/Common/LoadingState';
import ErrorState from '../components/Common/ErrorState';
import EmptyState from '../components/Common/EmptyState';

export const SkillExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSkill = searchParams.get('selected') || '';

  const [skills, setSkills] = useState([]);
  const [selectedSkillName, setSelectedSkillName] = useState(initialSkill);
  const [skillDetail, setSkillDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await SkillService.getAll();
      const list = res.data || [];
      setSkills(list);
      if (!selectedSkillName && list.length > 0) {
        setSelectedSkillName(list[0].name);
      }
    } catch (err) {
      setError(err.message || 'Failed to load skills catalog.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (!selectedSkillName) return;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await SkillService.getByName(selectedSkillName);
        setSkillDetail(res.data);
      } catch (err) {
        console.error('Skill detail error:', err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
    setSearchParams({ selected: selectedSkillName });
  }, [selectedSkillName]);

  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))];

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loadingList) return <CardSkeleton count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchSkills} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      
      {/* Sidebar - Skills Catalog & Categories */}
      <div className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Skill Nodes
            </h2>
            <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
              {filteredSkills.length}
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {filteredSkills.map((s) => {
            const isSelected = s.name === selectedSkillName;
            return (
              <div
                key={s.name}
                onClick={() => setSelectedSkillName(s.name)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'glass-card border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {s.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                  <span>{s.developerCount} engineers</span>
                  <span>•</span>
                  <span>{s.projectCount} projects</span>
                  <span>•</span>
                  <span>{s.jobCount} roles</span>
                </div>
              </div>
            );
          })}
          {filteredSkills.length === 0 && <EmptyState title="No skills match criteria" />}
        </div>
      </div>

      {/* Main Content Area - Graph Traversal Details */}
      <div className="lg:col-span-8 space-y-8">
        {loadingDetail ? (
          <Spinner message="Traversing CognoDB skill node graph..." />
        ) : skillDetail ? (
          <>
            {/* Header Card */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Cpu className="w-6 h-6" />
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{skillDetail.category}</span>
                  <h2 className="text-3xl font-extrabold text-white">{skillDetail.name}</h2>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800">
                Connected graph neighborhood for skill <strong className="text-emerald-300">{skillDetail.name}</strong> spanning candidates, implementations, open career roles, and hiring enterprises.
              </p>
            </div>

            {/* Engineers with this Skill */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Engineers Possessing Skill ({skillDetail.developers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillDetail.developers.map((dev) => (
                  <div
                    key={dev.name}
                    onClick={() => navigate(`/developers?selected=${encodeURIComponent(dev.name)}`)}
                    className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-brand-500/40 space-y-1"
                  >
                    <h4 className="font-bold text-sm text-slate-200">{dev.name}</h4>
                    <p className="text-xs text-slate-400">{dev.role} • {dev.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Using Skill */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-400" />
                Projects Built with {skillDetail.name} ({skillDetail.projects.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillDetail.projects.map((pr) => (
                  <div key={pr.name} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-200">{pr.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                        {pr.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{pr.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Job Roles Requiring Skill */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-400" />
                Job Opportunities Requiring Skill ({skillDetail.jobs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillDetail.jobs.map((j) => (
                  <div
                    key={j.title}
                    onClick={() => navigate(`/jobs?selected=${encodeURIComponent(j.title)}`)}
                    className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-brand-500/40 space-y-1"
                  >
                    <h4 className="font-bold text-sm text-slate-200">{j.title}</h4>
                    <p className="text-xs text-slate-400">{j.company} • {j.location}</p>
                  </div>
                ))}
              </div>
            </div>

          </>
        ) : (
          <EmptyState title="Select a skill to explore graph traversals" />
        )}
      </div>

    </div>
  );
};

export default SkillExplorer;
