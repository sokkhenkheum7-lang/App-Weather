import React from 'react';

export default function Loading({ themeMode }) {
  const isDark = themeMode === 'dark';
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        <div className={`w-20 h-20 border-4 rounded-full animate-spin ${
          isDark ? 'border-sky-400/20 border-t-sky-400' : 'border-sky-600/10 border-t-sky-500'
        }`}></div>
        <div className={`absolute w-12 h-12 border-4 rounded-full animate-spin [animation-duration:1s] [animation-direction:reverse] ${
          isDark ? 'border-indigo-400/10 border-b-indigo-400' : 'border-indigo-500/10 border-b-indigo-400'
        }`}></div>
        <div className={`absolute w-4 h-4 rounded-full animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.8)] ${
          isDark ? 'bg-sky-300' : 'bg-sky-500'
        }`}></div>
      </div>
      <div className="mt-8 space-y-3 w-64 max-w-full">
        <div className={`h-4 rounded-full w-3/4 mx-auto animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-900/15'}`}></div>
        <div className={`h-3 rounded-full w-1/2 mx-auto animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-900/10'}`}></div>
      </div>
    </div>
  );
}
