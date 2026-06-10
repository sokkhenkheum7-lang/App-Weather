import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

export default function WeatherCard({ weather, unit, onToggleUnit, themeMode }) {
  if (!weather) return null;

  const isDark = themeMode === 'dark';
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const formatTemp = (t) => Math.round(t);

  const getLocalDate = () => {
    const localTime = new Date((Date.now() + (weather.timezone - 25200) * 1000)); 
    return localTime.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  };

  const getLocalTime = () => {
    const localTime = new Date(Date.now() + (weather.timezone - 25200) * 1000);
    return localTime.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const isWarm = weather.main.temp > (unit === 'metric' ? 25 : 77);

  return (
    <div className={`relative h-full overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 flex flex-col justify-between group ${
      isDark 
        ? 'bg-slate-900/40 text-white shadow-xl hover:bg-slate-900/50 border border-white/[0.05]' 
        : 'bg-white text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100'
    }`}>
      
      {/* Structural Minimalist Temperature Corner Glow */}
      <div className={`absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-25 transition-all duration-1000 group-hover:scale-125 ${
        isWarm ? 'bg-orange-500' : 'bg-blue-500'
      }`} />

      {/* SECTION 1: Top Navigation & Metadata */}
      <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-solid border-current/5">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={16} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
          <h2 className="text-lg font-bold tracking-tight truncate">
            {weather.name}
          </h2>
          <span className={`text-[9px] font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded ${
            isDark ? 'bg-white/10 text-white/80' : 'bg-slate-900 text-white'
          }`}>
            {weather.sys.country}
          </span>
        </div>

        {/* Minimal Pill Selector Switch */}
        <div className={`p-0.5 rounded-xl flex items-center shrink-0 ${
          isDark ? 'bg-white/5' : 'bg-slate-100'
        }`}>
          {['metric', 'imperial'].map((type) => (
            <button
              key={type}
              onClick={unit !== type ? onToggleUnit : undefined}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                unit === type
                  ? (isDark ? 'bg-white text-slate-950 shadow-sm' : 'bg-white text-slate-900 shadow-sm')
                  : 'text-current opacity-40 hover:opacity-90'
              }`}
            >
              {type === 'metric' ? '°C' : '°F'}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: Hero Visual & Main Presentation Split */}
      <div className="grid grid-cols-12 gap-4 items-center my-auto py-6">
        
        {/* Bold Typography Temperature Readout */}
        <div className="col-span-7 space-y-1">
          <div className="relative inline-block select-all">
            <span className="text-6xl md:text-7xl font-bold tracking-tight block leading-none font-sans">
              {formatTemp(weather.main.temp)}
              <span className="text-2xl md:text-3xl font-light opacity-60 align-super ml-0.5">
                {tempUnit}
              </span>
            </span>
          </div>
          
          <div className="space-y-0.5 pt-1">
            <span className="text-sm font-extrabold capitalize tracking-tight block">
              {weather.weather[0].description}
            </span>
            <span className="text-xs font-medium block opacity-60">
              Feels like <span className="font-bold">{formatTemp(weather.main.feels_like)}{tempUnit}</span>
            </span>
          </div>
        </div>

        {/* Upscaled Floating Weather Icon Aura */}
        <div className="col-span-5 flex justify-end relative">
          {/* Proportional icon back-glow */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-current/5 blur-xl pointer-events-none" />
          
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
            alt={weather.weather[0].description}
            className="w-28 h-28 md:w-36 md:h-36 object-contain filter drop-shadow-md relative z-10 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* SECTION 3: Modern Informational Footer Rows */}
      <div className={`mt-auto pt-4 border-t border-solid border-current/5 grid grid-cols-2 gap-2 text-xs font-semibold ${
        isDark ? 'text-white/50' : 'text-slate-500'
      }`}>
        <div className="flex items-center gap-2">
          <Clock size={13} className="opacity-70" />
          <span>{getLocalTime()}</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Calendar size={13} className="opacity-70" />
          <span>{getLocalDate()}</span>
        </div>
      </div>

    </div>
  );
}