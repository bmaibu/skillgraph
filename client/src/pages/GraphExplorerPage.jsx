import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Share2, Users, Search, RefreshCw, Layers } from 'lucide-react';
import { GraphService, DeveloperService } from '../services/api';
import GraphExplorerCanvas from '../components/Graph/GraphExplorerCanvas';
import Spinner from '../components/Common/LoadingState';
import ErrorState from '../components/Common/ErrorState';

export const GraphExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDev = searchParams.get('developer') || '';

  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(initialDev);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [viewMode, setViewMode] = useState(initialDev ? 'developer' : 'full');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Developer Dropdown Catalog
  useEffect(() => {
    DeveloperService.getAll()
      .then(res => setDevelopers(res.data || []))
      .catch(err => console.error('Error loading dev list:', err));
  }, []);

  // Fetch Graph Payload
  const loadGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'developer' && selectedDeveloper) {
        const res = await DeveloperService.getGraph(selectedDeveloper);
        setGraphData(res.data || { nodes: [], links: [] });
      } else {
        const res = await GraphService.getFullGraph(150);
        setGraphData(res.data || { nodes: [], links: [] });
      }
    } catch (err) {
      setError(err.message || 'Unable to load graph network visualization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, [viewMode, selectedDeveloper]);

  const handleDeveloperSelect = (devName) => {
    setSelectedDeveloper(devName);
    setViewMode('developer');
    setSearchParams({ developer: devName });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Explorer Controls Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-500/20 text-brand-400 rounded-xl">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-white">Interactive Graph Network Explorer</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Visualize 2+ and 3+ hop relationships across candidates, projects, skills, companies, and jobs.
          </p>
        </div>

        {/* View Mode Toggle & Developer Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setViewMode('full');
                setSearchParams({});
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'full'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Graph
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'developer'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Developer Neighborhood
            </button>
          </div>

          {viewMode === 'developer' && (
            <select
              value={selectedDeveloper}
              onChange={(e) => handleDeveloperSelect(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
            >
              <option value="">-- Select Candidate --</option>
              {developers.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={loadGraph}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
            title="Reload Graph"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      {loading ? (
        <div className="h-[600px] glass-panel rounded-3xl flex items-center justify-center">
          <Spinner message="Calculating graph layout nodes and links..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadGraph} />
      ) : (
        <div className="h-[650px] shadow-2xl">
          <GraphExplorerCanvas graphData={graphData} height={650} />
        </div>
      )}

    </div>
  );
};

export default GraphExplorerPage;
