import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Eye,
  Sun,
  Sunset
} from 'lucide-react';

export default function WeatherDetails({ weather, unit, themeMode }) {
  if (!weather) return null;

  const isDark = themeMode === 'dark';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const formatTime = (timestamp) => {
    // Ensuring timezone alignment matching the core clock component
    const date = new Date((timestamp + (weather.timezone - 25200)) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const detailsList = [
    {
      id: 'humidity',
      title: 'Humidity',
      value: `${weather.main.humidity}%`,
      icon: <Droplets size={18} />,
      accent: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
      desc: 'Moisture content'
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      value: `${weather.wind.speed} ${speedUnit}`,
      icon: <Wind size={18} />,
      accent: 'text-sky-500 border-sky-500/20 bg-sky-500/5',
      desc: `${weather.wind.deg}° Direction`
    },
    {
      id: 'pressure',
      title: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      icon: <Compass size={18} />,
      accent: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
      desc: 'Atmospheric weight'
    },
    {
      id: 'visibility',
      title: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      icon: <Eye size={18} />,
      accent: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
      desc: 'Sight line distance'
    },
    {
      id: 'sunrise',
      title: 'Sunrise',
      value: formatTime(weather.sys.sunrise),
      icon: <Sun size={18} />,
      accent: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
      desc: 'Morning light'
    },
    {
      id: 'sunset',
      title: 'Sunset',
      value: formatTime(weather.sys.sunset),
      icon: <Sunset size={18} />,
      accent: 'text-orange-500 border-orange-500/20 bg-orange-500/5',
      desc: 'Evening glow'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8">
      {detailsList.map((detail) => (
        <div
          key={detail.id}
          className={`
            relative overflow-hidden rounded-3xl p-5 md:p-6
            transition-all duration-500
            flex flex-col justify-between group
            border border-solid
            ${
              isDark
                ? 'bg-slate-900/40 text-white hover:bg-slate-900/50 border-white/[0.05] shadow-xl'
                : 'bg-white text-slate-900 border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
            }
          `}
        >
          {/* Subtle Ambient Bottom Accent Glow */}
          <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${detail.accent.split(' ')[0].replace('text', 'bg')}`} />

          {/* Top Row: Meta Label and Aesthetic Micro-Icon */}
          <div className="flex items-center justify-between gap-3">
            <span className={`text-[10px] uppercase font-bold tracking-widest ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}>
              {detail.title}
            </span>
            
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 shrink-0 ${detail.accent}`}>
              {detail.icon}
            </div>
          </div>

          {/* Main Informational Text Layout Stack */}
          <div className="mt-4 md:mt-6 space-y-0.5">
            <h3 className="text-2xl font-bold tracking-tight leading-none font-sans">
              {detail.value}
            </h3>
            <p className={`text-xs font-medium opacity-60 truncate ${
              isDark ? 'text-white' : 'text-slate-500'
            }`}>
              {detail.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}