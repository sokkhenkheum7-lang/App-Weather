import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function ForecastList({ forecastData, unit, themeMode }) {
  if (!forecastData?.length) return null;

  const isDark = themeMode === 'dark';
  const tempUnit = unit === 'metric' ? '°C' : '°F';

  const getWeatherStyle = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear':
        return { accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'clouds':
        return { accent: 'text-slate-400 bg-slate-400/10 border-slate-400/20' };
      case 'rain':
      case 'drizzle':
        return { accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'thunderstorm':
        return { accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'snow':
        return { accent: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' };
      default:
        return { accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
  };

  const reorderFromTomorrow = (data) => {
    if (!data?.length) return [];
    const today = new Date().getDay();
    const startIndex = data.findIndex((day) => {
      const dayIndex = new Date(day.dt * 1000).getDay();
      return dayIndex !== today;
    });
    if (startIndex === -1) return data;
    return [...data.slice(startIndex), ...data.slice(0, startIndex)];
  };

  const sortedData = reorderFromTomorrow(forecastData).slice(0, 7);

  return (
    <div className="w-full relative mt-8">
      {/* Structural Minimalist Ambient Glow */}
      <div className={`absolute -right-24 -bottom-24 w-72 h-72 rounded-full blur-[120px] pointer-events-none opacity-15 transition-all duration-1000 ${
        isDark ? 'bg-indigo-500' : 'bg-emerald-300'
      }`} />

      {/* Main Base Card Shell */}
      <div className={`relative rounded-[32px] p-6 md:p-8 transition-all duration-500 border backdrop-blur-xl ${
        isDark 
          ? 'bg-slate-950/20 text-white border-white/[0.06] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]' 
          : 'bg-white/60 text-slate-900 border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)]'
      }`}>
        
        {/* Section Typography Header */}
        <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-solid border-current/[0.06]">
          <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 border ${
            isDark ? 'bg-white/5 text-emerald-400 border-white/[0.05]' : 'bg-white text-emerald-600 border-slate-100 shadow-sm'
          }`}>
            <CalendarDays size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight bg-gradient-to-r from-current to-current/80 bg-clip-text">
              7-Day Forecast
            </h3>
            {/* UPDATED: "Daily weather outlook" color changed to clean ocean cyan */}
            <p className={`text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Daily weather outlook
            </p>
          </div>
        </div>

        {/* Forecast Auto Grid Matrix Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr gap-4 w-full">
          {sortedData.map((day, idx) => {
            const weather = getWeatherStyle(day.weather?.[0]?.main);
            const dateObj = new Date(day.dt * 1000);

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[24px] p-5 transition-all duration-500 flex flex-col items-center justify-between group border border-solid hover:-translate-y-1.5 ${
                  isDark 
                    ? 'bg-gradient-to-b from-white/[0.03] to-transparent hover:from-white/[0.06] border-white/[0.04] hover:border-white/[0.1] shadow-lg hover:shadow-2xl' 
                    : 'bg-gradient-to-b from-white to-slate-50/40 hover:from-white hover:to-slate-50 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl'
                }`}
              >
                {/* Micro Ambient Hover Glow behind item */}
                <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-25 transition-opacity duration-500 ${weather.accent.split(' ')[0].replace('text', 'bg')}`} />

                {/* Date Labels Layout */}
                <div className="text-center space-y-0.5 w-full z-10">
                  <h4 className="font-bold text-sm tracking-tight text-current/90 group-hover:text-current transition-colors duration-300 truncate px-0.5">
                    {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h4>
                  {/* UPDATED: Month/Day label color changed to vibrant ocean cyan */}
                  <p className={`text-[11px] font-bold tracking-wider uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Floating Pure Weather Icon Aura */}
                {/* UPDATED: Increased image frame size to w-28 h-28 for higher impact layout */}
                <div className="my-2 relative flex items-center justify-center z-10">
                  <div className="absolute w-20 h-20 rounded-full bg-current/[0.02] blur-md pointer-events-none transition-transform duration-500 group-hover:scale-130" />
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@4x.png`}
                    className="w-28 h-28 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-500 group-hover:scale-105"
                    alt="Forecast condition icon"
                  />
                </div>

                {/* Temperature Range Presentation Segment */}
                <div className="w-full text-center space-y-3.5 z-10">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-xl font-bold tracking-tight font-sans">
                      {Math.round(day.temp?.max ?? day.main?.temp_max ?? 0)}°
                    </span>
                    <span className={`text-sm font-light opacity-35 ${isDark ? 'text-white' : 'text-slate-500'}`}>
                      {Math.round(day.temp?.min ?? day.main?.temp_min ?? 0)}°
                    </span>
                  </div>

                  {/* Clean Proportional High-low Bar */}
                  <div className={`h-1 rounded-full overflow-hidden w-14 mx-auto ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 group-hover:scale-x-105 ${weather.accent.split(' ')[0].replace('text', 'bg')}`}
                      style={{
                        width: `${Math.max(25, Math.min(100, (day.temp?.max ?? day.main?.temp_max ?? 0) * 2.5))}%`,
                      }}
                    />
                  </div>

                  {/* Text Description Badge */}
                  <span className={`text-[10px] uppercase font-bold tracking-widest block truncate max-w-full px-2.5 py-1 rounded-lg border border-solid opacity-95 transition-all duration-300 shadow-sm ${weather.accent}`}>
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