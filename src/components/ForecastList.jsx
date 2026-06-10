import React from 'react';
import { CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ForecastList({ forecastData, unit, themeMode }) {
  if (!forecastData?.length) return null;

  const isDark = themeMode === 'dark';

  // Enhanced styles including unique gradients and thematic colors per weather type
  const getWeatherStyle = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear':
        return { 
          accent: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
          gradient: 'from-amber-500/10 to-orange-500/0 dark:from-amber-500/5 dark:to-transparent'
        };
      case 'clouds':
        return { 
          accent: 'text-slate-500 dark:text-slate-400 bg-slate-500/10 border-slate-500/20',
          gradient: 'from-slate-400/10 to-slate-500/0 dark:from-slate-400/5 dark:to-transparent'
        };
      case 'rain':
      case 'drizzle':
        return { 
          accent: 'text-sky-500 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
          gradient: 'from-sky-500/10 to-indigo-500/0 dark:from-sky-500/5 dark:to-transparent'
        };
      case 'thunderstorm':
        return { 
          accent: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
          gradient: 'from-purple-500/10 to-pink-500/0 dark:from-purple-500/5 dark:to-transparent'
        };
      case 'snow':
        return { 
          accent: 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-400/20',
          gradient: 'from-cyan-400/10 to-blue-500/0 dark:from-cyan-400/5 dark:to-transparent'
        };
      default:
        return { 
          accent: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          gradient: 'from-emerald-500/10 to-teal-500/0 dark:from-emerald-500/5 dark:to-transparent'
        };
    }
  };

  const sortedData = [...forecastData].sort((a, b) => a.dt - b.dt).slice(0, 7);

  return (
    /* Contained and centered layout block */
    <div className="w-full max-w-5xl mx-auto relative mt-4 select-none px-1">
      {/* Background Ambient Orbs */}
      <div className={`absolute -right-24 -top-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-1000 ${
        isDark ? 'bg-indigo-500/40' : 'bg-emerald-300/50'
      }`} />
      <div className={`absolute -left-24 -bottom-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-10 transition-all duration-1000 ${
        isDark ? 'bg-purple-500/30' : 'bg-sky-200/40'
      }`} />

      {/* Main Container Card */}
      <div className={`relative rounded-[32px] p-5 md:p-6 transition-all duration-500 border backdrop-blur-2xl ${
        isDark 
          ? 'bg-slate-900/40 text-slate-100 border-white/[0.06] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)]' 
          : 'bg-white/70 text-slate-800 border-slate-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.04)]'
      }`}>
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-solid border-slate-500/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
              isDark ? 'bg-white/5 text-emerald-400 border-white/[0.05]' : 'bg-slate-50 text-emerald-600 border-slate-200/80 shadow-sm'
            }`}>
              <CalendarDays size={16} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">7-Day Forecast</h3>
              <p className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Detailed daily weather outlook
              </p>
            </div>
          </div>
          
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            7 Days Total
          </span>
        </div>

        {/* Forecast Grid Matrix (Optimized column widths for centered presentation) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr gap-3.5 w-full">
          {sortedData.map((day, idx) => {
            const weather = getWeatherStyle(day.weather?.[0]?.main);
            const dateObj = new Date(day.dt * 1000);
            const isToday = new Date().toDateString() === dateObj.toDateString();

            const maxTemp = Math.round(day.temp?.max ?? day.main?.temp_max ?? 0);
            const minTemp = Math.round(day.temp?.min ?? day.main?.temp_min ?? 0);

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[22px] p-4 transition-all duration-500 flex flex-col items-center justify-between group border border-solid hover:-translate-y-1 hover:shadow-xl ${
                  isToday
                    ? isDark
                      ? 'bg-gradient-to-b from-indigo-500/15 via-slate-900/50 to-slate-900/20 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/30'
                      : 'bg-gradient-to-b from-indigo-50/70 via-white to-white border-indigo-200 shadow-md ring-1 ring-indigo-100/50'
                    : isDark 
                      ? 'bg-gradient-to-b from-white/[0.02] to-transparent hover:border-white/[0.1] border-white/[0.04]' 
                      : 'bg-gradient-to-b from-slate-50/50 to-white hover:bg-white hover:border-slate-300 border-slate-100 shadow-sm'
                }`}
              >
                {/* Micro Ambient Glow Background inside Card */}
                <div className={`absolute inset-0 bg-gradient-to-b ${weather.gradient} opacity-100 pointer-events-none transition-opacity duration-500`} />
                <div className={`absolute -bottom-10 -right-10 w-16 h-16 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${weather.accent.split(' ')[0].replace('text', 'bg')}`} />
                
                {/* Date Layout */}
                <div className="text-center space-y-0.5 w-full z-10 relative">
                  <h4 className={`font-bold text-xs tracking-tight transition-colors duration-300 truncate ${
                    isToday ? 'text-indigo-500 dark:text-indigo-400 text-sm' : 'text-current opacity-90'
                  }`}>
                    {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                  </h4>
                  <p className={`text-[9px] font-bold tracking-widest uppercase opacity-50`}>
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Weather Icon Frame (Slightly downscaled to save grid height space) */}
                <div className="my-2 relative flex items-center justify-center z-10">
                  <div className="absolute w-12 h-12 rounded-full bg-current/[0.01] blur-md pointer-events-none transition-all duration-500 group-hover:scale-120 group-hover:bg-current/[0.03]" />
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@4x.png`}
                    className="w-16 h-16 object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
                    alt={day.weather?.[0]?.description || "Weather outlook"}
                  />
                </div>

                {/* Temperature & Details Block */}
                <div className="w-full text-center space-y-3 z-10 relative">
                  
                  {/* Temperature Readout */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center font-bold text-base tracking-tight">
                      <span>{maxTemp}°</span>
                    </div>
                    <div className="h-2.5 w-[1px] bg-current/10" />
                    <div className="flex items-center text-xs font-medium opacity-40">
                      <span>{minTemp}°</span>
                    </div>
                  </div>

                  {/* Horizontal Thermometer Progress Bar Indicator */}
                  <div className="relative w-12 h-1 mx-auto rounded-full overflow-hidden bg-slate-500/10 backdrop-blur-sm">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${weather.accent.split(' ')[0].replace('text', 'bg')}`}
                      style={{
                        width: `${Math.max(30, Math.min(100, ((maxTemp + 20) / 60) * 100))}%`,
                        transformOrigin: 'left'
                      }}
                    />
                  </div>

                  {/* Weather Condition Badge */}
                  <span className={`text-[8px] uppercase font-black tracking-widest block truncate max-w-full px-2 py-1 rounded-lg border transition-all duration-300 shadow-sm font-mono ${weather.accent}`}>
                    {day.weather?.[0]?.main}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}