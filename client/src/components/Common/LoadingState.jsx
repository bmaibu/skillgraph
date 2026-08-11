import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ message = 'Loading graph data...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-4" />
    <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
  </div>
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-slate-800/80 rounded w-full" />
        <div className="h-3 bg-slate-800/80 rounded w-4/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-slate-800 rounded-full" />
          <div className="h-6 w-20 bg-slate-800 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default Spinner;
