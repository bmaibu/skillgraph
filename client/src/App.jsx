import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import DeveloperExplorer from './pages/DeveloperExplorer';
import SkillExplorer from './pages/SkillExplorer';
import JobExplorer from './pages/JobExplorer';
import GraphExplorerPage from './pages/GraphExplorerPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface-900 text-slate-100 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/developers" element={<DeveloperExplorer />} />
            <Route path="/skills" element={<SkillExplorer />} />
            <Route path="/jobs" element={<JobExplorer />} />
            <Route path="/graph" element={<GraphExplorerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-auto">
          <p>© {new Date().getFullYear()} SkillGraph — Backed by CognoDB Graph Engine & Official Neo4j Driver</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
