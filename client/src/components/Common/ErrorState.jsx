import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Unable to connect to the graph database.',
  message = 'Please check your CognoDB instance, network connection, or try again.',
  onRetry
}) => (
  <div className="glass-card p-8 rounded-2xl border border-red-500/30 bg-red-950/20 max-w-xl mx-auto my-8 text-center">
    <div className="inline-flex p-3 bg-red-500/10 text-red-400 rounded-full mb-4">
      <AlertTriangle className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Connection
      </button>
    )}
  </div>
);

export default ErrorState;
