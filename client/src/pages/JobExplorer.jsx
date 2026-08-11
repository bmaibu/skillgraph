import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, MapPin, Search, CheckCircle2, XCircle, UserCheck, Sparkles } from 'lucide-react';
import { JobService, DeveloperService } from '../services/api';
import Spinner, { CardSkeleton } from '../components/Common/LoadingState';
import ErrorState from '../components/Common/ErrorState';
import EmptyState from '../components/Common/EmptyState';

export const JobExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialJob = searchParams.get('selected') || '';

  const [jobs, setJobs] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState(initialJob);
  const [jobDetail, setJobDetail] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [loadingList, setLoadingList] = useState(true);
  const [loadingGap, setLoadingGap] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const [jobsRes, devRes] = await Promise.all([
        JobService.getAll(),
        DeveloperService.getAll()
      ]);
      const jobList = jobsRes.data || [];
      const devList = devRes.data || [];

      setJobs(jobList);
      setDevelopers(devList);

      if (!selectedJobTitle && jobList.length > 0) {
        setSelectedJobTitle(jobList[0].title);
      }
      if (devList.length > 0) {
        setSelectedDeveloper(devList[0].name);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job opportunities.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedJobTitle) return;

    const fetchGap = async () => {
      setLoadingGap(true);
      try {
        const [jobRes, gapRes] = await Promise.all([
          JobService.getByTitle(selectedJobTitle),
          selectedDeveloper ? JobService.getSkillGap(selectedJobTitle, selectedDeveloper) : Promise.resolve(null)
        ]);
        setJobDetail(jobRes.data);
        if (gapRes) setSkillGap(gapRes.data);
      } catch (err) {
        console.error('Error fetching job details / gap:', err);
      } finally {
        setLoadingGap(false);
      }
    };

    fetchGap();
    setSearchParams({ selected: selectedJobTitle });
  }, [selectedJobTitle, selectedDeveloper]);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loadingList) return <CardSkeleton count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner & Candidate Match Filter */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-white">Job Opportunities & Skill Matching</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select a candidate to calculate skill match score & skill gap against any open job role.
          </p>
        </div>

        {/* Candidate Selector */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <UserCheck className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-semibold text-slate-300">Candidate:</span>
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
          >
            {developers.map(d => (
              <option key={d.name} value={d.name}>{d.name} ({d.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search jobs by title, company, or required skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Jobs Grid & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Job Cards Listing */}
        <div className="lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {filteredJobs.map((j) => {
            const isSelected = j.title === selectedJobTitle;
            return (
              <div
                key={j.title}
                onClick={() => setSelectedJobTitle(j.title)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-600/10 border-rose-500 shadow-lg shadow-rose-500/10'
                    : 'glass-card border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{j.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span className="text-slate-300 font-semibold">{j.company}</span>
                      <span>•</span>
                      <span>{j.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-rose-300">
                    {j.experienceLevel}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {j.requiredSkills.map(s => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredJobs.length === 0 && <EmptyState title="No matching jobs found" />}
        </div>

        {/* Selected Job & Skill Gap Analyzer */}
        <div className="lg:col-span-6">
          {loadingGap ? (
            <Spinner message="Computing Cypher skill gap analysis..." />
          ) : jobDetail && skillGap ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">{jobDetail.company}</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{jobDetail.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {jobDetail.location} • {jobDetail.experienceLevel} Level
                </p>
              </div>

              {/* Match Readiness Gauge Card */}
              <div className="glass-card p-5 rounded-2xl border border-brand-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400">Candidate Match Score</h4>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{selectedDeveloper}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-brand-400">{skillGap.readinessScore}%</span>
                  <p className="text-[10px] text-slate-400">{skillGap.matchedCount} of {skillGap.totalCount} skills matched</p>
                </div>
              </div>

              {/* Matched Skills List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Matching Skills ({skillGap.matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.matchedSkills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                      ✓ {s}
                    </span>
                  ))}
                  {skillGap.matchedSkills.length === 0 && (
                    <span className="text-xs text-slate-500">No matching skills found for candidate.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills Gap */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  Required Skill Gap ({skillGap.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.missingSkills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30">
                      ✗ {s}
                    </span>
                  ))}
                  {skillGap.missingSkills.length === 0 && (
                    <span className="text-xs text-emerald-400 font-semibold">Candidate meets 100% of job requirements!</span>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <EmptyState title="Select a job role to inspect skill gap" />
          )}
        </div>

      </div>

    </div>
  );
};

export default JobExplorer;
