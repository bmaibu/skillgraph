import React from 'react';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your search terms or filters to explore the graph dataset.'
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-800 my-6">
    <div className="p-4 bg-slate-800/50 text-slate-400 rounded-2xl mb-4">
      <SearchX className="w-10 h-10" />
    </div>
    <h4 className="text-lg font-semibold text-slate-200 mb-1">{title}</h4>
    <p className="text-slate-400 text-sm max-w-md">{description}</p>
  </div>
);

export default EmptyState;
