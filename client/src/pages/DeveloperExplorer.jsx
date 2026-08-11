import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Briefcase, Award, FolderGit2, CheckCircle2, XCircle, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { DeveloperService, JobService } from '../services/api';
import Spinner, { CardSkeleton } from '../components/Common/LoadingState';
import ErrorState from '../components/Common/ErrorState';
import EmptyState from '../components/Common/EmptyState';

export const DeveloperExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialDev = searchParams.get('selected') || '';

  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeveloperName, setSelectedDeveloperName] = useState(initialDev);
  const [developerDetail, setDeveloperDetail] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [similarDevs, setSimilarDevs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingGap, setLoadingGap] = useState(false);
  const [error, setError] = useState(null);

  // Load Developer Catalog
  const fetchDevelopers = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await DeveloperService.getAll();
      const devList = res.data || [];
      setDevelopers(devList);
      if (!selectedDeveloperName && devList.length > 0) {
        setSelectedDeveloperName(devList[0].name);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch developers catalog.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Load Selected Developer Detail, Recommendations, and Similar Devs
  useEffect(() => {
    if (!selectedDeveloperName) return;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      setSelectedJob(null);
      setSkillGap(null);
      try {
        const [devRes, recRes, simRes] = await Promise.all([
          DeveloperService.getByName(selectedDeveloperName),
          DeveloperService.getRecommendations(selectedDeveloperName),
          DeveloperService.getSimilar(selectedDeveloperName)
        ]);
        setDeveloperDetail(devRes.data);
        setRecommendations(recRes.data || []);
        setSimilarDevs(simRes.data || []);
        if (recRes.data && recRes.data.length > 0) {
          handleJobSelect(recRes.data[0]);
        }
      } catch (err) {
        console.error('Error fetching developer details:', err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
    setSearchParams({ selected: selectedDeveloperName });
  }, [selectedDeveloperName]);

  // Load Skill Gap for Selected Job
  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    if (!job || !selectedDeveloperName) return;
    setLoadingGap(true);
    try {
      const gapRes = await JobService.getSkillGap(job.title, selectedDeveloperName);
      setSkillGap(gapRes.data);
    } catch (err) {
      console.error('Skill gap error:', err);
    } finally {
      setLoadingGap(false);
    }
  };

  const filteredDevelopers = developers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingList) return <CardSkeleton count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchDevelopers} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      
      {/* Sidebar - Developer List & Search */}
      <div className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span>Developers</span>
            <span className="text-xs bg-slate-800 text-brand-400 px-2 py-0.5 rounded-full">
              {filteredDevelopers.length}
            </span>
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredDevelopers.map((dev) => {
            const isSelected = dev.name === selectedDeveloperName;
            return (
              <div
                key={dev.name}
                onClick={() => setSelectedDeveloperName(dev.name)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                    : 'glass-card border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-100">{dev.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {dev.experienceYears}y exp
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{dev.role}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span>{dev.skillCount} skills</span>
                  <span>•</span>
                  <span>{dev.projectCount} projects</span>
                </div>
              </div>
            );
          })}
          {filteredDevelopers.length === 0 && <EmptyState title="No developers match search" />}
        </div>
      </div>

      {/* Main Content Area - Selected Developer Profile & Insights */}
      <div className="lg:col-span-8 space-y-8">
        {loadingDetail ? (
          <Spinner message="Executing Cypher multi-hop traversals..." />
        ) : developerDetail ? (
          <>
            {/* Developer Header Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{developerDetail.name}</h2>
                    <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                      {developerDetail.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {developerDetail.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {developerDetail.experienceYears} Years Experience
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/graph?developer=${encodeURIComponent(developerDetail.name)}`)}
                  className="px-4 py-2.5 bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 w-fit"
                >
                  <Share2 className="w-4 h-4" />
                  View Graph Network
                </button>
              </div>

              {/* Skills Badges Grid */}
              <div className="mt-6 pt-6 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Known Skills Graph</h4>
                <div className="flex flex-wrap gap-2">
                  {developerDetail.skills.map((s) => (
                    <span
                      key={s.name}
                      onClick={() => navigate(`/skills?selected=${encodeURIComponent(s.name)}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-medium hover:border-brand-500 cursor-pointer transition-all"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects & Worked At Grid */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-400" />
                Built Projects & Portfolio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {developerDetail.projects.map((pr) => (
                  <div key={pr.name} className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-200">{pr.name}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        {pr.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{pr.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Jobs & Skill Gap Analysis */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    Recommended Career Opportunities
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Graph overlap matching candidate skills against company requirements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((job) => {
                  const isSelected = selectedJob?.title === job.title;
                  return (
                    <div
                      key={job.title}
                      onClick={() => handleJobSelect(job)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-600/10 border-brand-500 shadow-md shadow-brand-500/10'
                          : 'glass-card border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{job.title}</h4>
                          <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-emerald-400">{job.matchPercentage}%</span>
                          <p className="text-[10px] text-slate-500">{job.matchCount}/{job.totalRequired} skills</p>
                        </div>
                      </div>

                      {/* Matching Skills */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.matchedSkills.map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-medium">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Skill Gap Analysis Drawer */}
              {selectedJob && (
                <div className="mt-6 p-6 glass-card rounded-2xl border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-slate-200">
                      Skill Gap Analysis: <span className="text-brand-300">{selectedJob.title}</span> ({selectedJob.company})
                    </h4>
                    <span className="text-xs font-semibold text-slate-400">
                      Readiness Score: <strong className="text-brand-400">{skillGap?.readinessScore || selectedJob.matchPercentage}%</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matching Skills */}
                    <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-emerald-500/20">
                      <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Matched Skills ({skillGap?.matchedSkills?.length || selectedJob.matchedSkills.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(skillGap?.matchedSkills || selectedJob.matchedSkills).map(s => (
                          <span key={s} className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills Gap */}
                    <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-rose-500/20">
                      <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Skill Gap / Missing ({skillGap?.missingSkills?.length || selectedJob.missingSkills.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(skillGap?.missingSkills || selectedJob.missingSkills).map(s => (
                          <span key={s} className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-medium">
                            {s}
                          </span>
                        ))}
                        {(skillGap?.missingSkills || selectedJob.missingSkills).length === 0 && (
                          <span className="text-xs text-slate-500">Perfect 100% Skill Match!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Similar Developers Recommendation */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Similar Engineers (Collaborative Graph Overlap)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarDevs.map((dev) => (
                  <div
                    key={dev.name}
                    onClick={() => setSelectedDeveloperName(dev.name)}
                    className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-brand-500/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-200">{dev.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                        {dev.sharedSkillCount} Shared Skills
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{dev.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyState title="Select a developer to view graph details" />
        )}
      </div>

    </div>
  );
};

export default DeveloperExplorer;
