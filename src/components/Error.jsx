import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function Error({ message, onRetry, themeMode }) {
  const isDark = themeMode === 'dark';
  return (
    <div className={`glass-card max-w-md mx-auto p-8 rounded-3xl border text-center transform transition-all hover:scale-[1.01] animate-fadeIn ${
      isDark 
        ? 'border-rose-500/30 bg-rose-950/10 shadow-rose-950/40 text-rose-200' 
        : 'border-rose-300 bg-white/85 shadow-xl text-slate-950'
    }`}>
      <div className={`inline-flex p-4 rounded-2xl mb-4 animate-bounce ${isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'}`}>
        <AlertTriangle size={36} />
      </div>
      <h3 className="text-xl font-black mb-2">Location Not Found</h3>
      <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/70' : 'text-slate-800 font-medium'}`}>
        {message || "We couldn't retrieve the weather. Please verify spelling, province, or check connection."}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto active:scale-95"
        >
          <RotateCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}