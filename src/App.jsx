import React, { useState, useEffect } from "react";
import {
  CloudRain,
  Sun,
  Moon,
  History,
  Trash2,
  Cpu,
} from "lucide-react";

import { weatherApi } from "./services/weatherApi";
import Loading from "./components/Loading";
import Error from "./components/Error";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import ForecastList from "./components/ForecastList";
import logo from './assets/image.png';

const STAR_MAP = [
  { top: "5%", left: "8%", delay: "0s", size: "1px" },
  { top: "12%", left: "18%", delay: "1.2s", size: "2px" },
  { top: "8%", left: "32%", delay: "0.4s", size: "1.5px" },
  { top: "22%", left: "40%", delay: "2.1s", size: "3px" },
  { top: "4%", left: "55%", delay: "1.7s", size: "1px" },
  { top: "15%", left: "64%", delay: "0.9s", size: "2px" },
  { top: "7%", left: "78%", delay: "2.5s", size: "1.5px" },
  { top: "19%", left: "88%", delay: "0.6s", size: "2.5px" },
  { top: "28%", left: "5%", delay: "1.4s", size: "2px" },
  { top: "34%", left: "22%", delay: "3.0s", size: "1px" },
  { top: "26%", left: "50%", delay: "1.8s", size: "2px" },
  { top: "32%", left: "73%", delay: "0.2s", size: "1.5px" },
  { top: "29%", left: "94%", delay: "2.2s", size: "3px" },
  { top: "42%", left: "12%", delay: "1.5s", size: "2px" },
  { top: "45%", left: "60%", delay: "2.7s", size: "1px" },
  { top: "38%", left: "82%", delay: "0.5s", size: "2px" }
];

const SNOW_MAP = [
  { left: "5%", size: "4px", delay: "0s", duration: "8s", blur: "1px" },
  { left: "15%", size: "6px", delay: "2s", duration: "11s", blur: "2px" },
  { left: "25%", size: "3px", delay: "0.5s", duration: "7s", blur: "0px" },
  { left: "38%", size: "5px", delay: "4s", duration: "13s", blur: "1px" },
  { left: "45%", size: "7px", delay: "1.5s", duration: "10s", blur: "2px" },
  { left: "58%", size: "4px", delay: "3s", duration: "9s", blur: "0px" },
  { left: "68%", size: "6px", delay: "0.8s", duration: "12s", blur: "1px" },
  { left: "78%", size: "3px", delay: "5s", duration: "8s", blur: "0px" },
  { left: "88%", size: "5px", delay: "2.3s", duration: "11s", blur: "2px" },
  { left: "95%", size: "4px", delay: "1.1s", duration: "9s", blur: "1px" }
];

const ICE_MAP = [
  { left: "10%", length: "14px", delay: "0.2s", duration: "1.8s" },
  { left: "30%", length: "22px", delay: "1.1s", duration: "1.4s" },
  { left: "52%", length: "16px", delay: "0.5s", duration: "2.2s" },
  { left: "75%", length: "25px", delay: "1.6s", duration: "1.6s" },
  { left: "90%", length: "18px", delay: "0.8s", duration: "2.0s" }
];

const RAIN_MAP = [
  { left: "4%", height: "25px", opacity: "0.4", duration: "1.2s", delay: "0s" },
  { left: "12%", height: "35px", opacity: "0.6", duration: "0.9s", delay: "0.4s" },
  { left: "19%", height: "20px", opacity: "0.3", duration: "1.5s", delay: "0.2s" },
  { left: "28%", height: "40px", opacity: "0.7", duration: "0.8s", delay: "0.7s" },
  { left: "36%", height: "30px", opacity: "0.5", duration: "1.1s", delay: "0.1s" },
  { left: "44%", height: "22px", opacity: "0.4", duration: "1.3s", delay: "0.5s" },
  { left: "52%", height: "38px", opacity: "0.8", duration: "0.85s", delay: "0.3s" },
  { left: "61%", height: "25px", opacity: "0.3", duration: "1.4s", delay: "0.9s" },
  { left: "70%", height: "45px", opacity: "0.6", duration: "0.75s", delay: "0.2s" },
  { left: "78%", height: "28px", opacity: "0.5", duration: "1.15s", delay: "0.6s" },
  { left: "85%", height: "32px", opacity: "0.4", duration: "1.0s", delay: "0.1s" },
  { left: "93%", height: "22px", opacity: "0.3", duration: "1.6s", delay: "0.4s" },
  { left: "98%", height: "38px", opacity: "0.7", duration: "0.9s", delay: "0.1s" }
];

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unit, setUnit] = useState("metric");
  const [themeMode, setThemeMode] = useState("dark");

  const [searchHistory, setSearchHistory] = useState([]);
  const [currentCity, setCurrentCity] = useState("Phnom Penh");

  useEffect(() => {
    try {
      const history = localStorage.getItem("weather_search_history");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (err) {
      console.warn("Failed to load history:", err);
    }
    loadWeatherData(currentCity);
  }, [unit]);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSearch = (city) => {
    if (city?.trim()) {
      loadWeatherData(city.trim());
    }
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem("weather_search_history");
    } catch (err) {
      console.warn(err);
    }
  };

  const saveToHistory = (cityName) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (city) => city.toLowerCase() !== cityName.toLowerCase()
      );
      const updated = [cityName, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("weather_search_history", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to save history:", err);
      }
      return updated;
    });
  };

  const loadWeatherData = async (cityName, triggerLoader = true) => {
    if (triggerLoader) setLoading(true);
    setError(null);
    try {
      const weatherData = await weatherApi.getWeatherByCity(cityName, unit);
      setWeather(weatherData);
      setCurrentCity(weatherData.name);
      saveToHistory(weatherData.name);

      const forecastData = await weatherApi.getForecastByCoords(
        weatherData.coord.lat,
        weatherData.coord.lon,
        unit
      );
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || "Failed to load weather data.");
    } finally {
      if (triggerLoader) setLoading(false);
    }
  };

  const getAmbientClass = () => {
    if (themeMode === "light") {
      return "from-sky-400 via-indigo-200 to-amber-100 text-slate-950";
    }
    if (!weather) {
      return "from-slate-950 via-slate-900 to-indigo-950 text-white";
    }

    const condition = weather?.weather?.[0]?.main?.toLowerCase() || "";
    const description = weather?.weather?.[0]?.description?.toLowerCase() || "";

    if (condition.includes("ice") || condition.includes("freezing") || description.includes("sleet") || description.includes("hail")) {
      return "from-slate-950 via-cyan-950/40 to-slate-900 text-cyan-100";
    }
    if (condition.includes("snow")) {
      if (description.includes("light")) {
        return "from-slate-950 via-slate-900 to-sky-950 text-slate-200";
      }
      return "from-neutral-950 via-slate-900 to-indigo-950 text-white";
    }
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) {
      return "from-slate-950 via-slate-900 to-blue-950/70 text-slate-100";
    }
    return "from-slate-950 via-indigo-950 to-slate-900 text-white";
  };

  const mainCondition = weather?.weather?.[0]?.main?.toLowerCase() || "";
  const descCondition = weather?.weather?.[0]?.description?.toLowerCase() || "";

  const isDark = themeMode === "dark";
  
  const isRainy = (mainCondition.includes("rain") || mainCondition.includes("drizzle") || mainCondition.includes("thunderstorm")) && !descCondition.includes("freezing");
  const isSnowy = mainCondition.includes("snow");
  const isLightSnow = isSnowy && descCondition.includes("light");
  const isIcy = (mainCondition.includes("ice") || descCondition.includes("freezing") || descCondition.includes("sleet") || descCondition.includes("hail"));

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 bg-gradient-to-b ${getAmbientClass()}`}>
      
      <style>{`
        @keyframes drift {
          0% { transform: translateX(-40%); }
          100% { transform: translateX(140%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); filter: drop-shadow(0 0 4px #fcd34d); }
        }
        @keyframes oceanShimmer {
          0%, 100% { transform: translateX(-50%) skewX(-12deg); opacity: 0.25; }
          50% { transform: translateX(-46%) skewX(12deg); opacity: 0.50; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fallRain {
          0% { transform: translateY(-150px) skewX(-10deg); opacity: 0; }
          20% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(110%) skewX(-10deg); opacity: 0; }
        }
        @keyframes fallSnow {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(110%) translateX(45px) rotate(360deg); opacity: 0; }
        }
        @keyframes fallIce {
          0% { transform: translateY(-40px) translateX(0) skewX(-5deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translateY(110%) translateX(15px) skewX(-5deg); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-drift-slow { animation: drift 90s linear infinite; }
        .animate-drift-med { animation: drift 60s linear infinite; }
        .animate-drift-fast { animation: drift 35s linear infinite; }
        .animate-twinkle { animation: twinkle 3.5s ease-in-out infinite; }
        .animate-shimmer { animation: oceanShimmer 7s ease-in-out infinite; }
        .animate-orb { animation: floatOrb 5s ease-in-out infinite; }
        .animate-rain-stream { animation: fallRain linear infinite; }
        .animate-snow { animation: fallSnow linear infinite forwards; }
        .animate-ice { animation: fallIce linear infinite; }
        .animate-pulse-glow { animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Dynamic Scenery Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {isDark && (
          <div className="absolute inset-0 transition-opacity duration-1000">
            {STAR_MAP.map((star, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Cinematic Clouds */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-[8%] left-0 w-[650px] h-36 opacity-30 dark:opacity-20 blur-2xl bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-drift-slow" style={{ animationDelay: '-20s' }} />
          <div className="absolute top-[14%] left-0 flex items-end animate-drift-med opacity-65 dark:opacity-40 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]">
            <div className={`w-32 h-24 rounded-full blur-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`} />
            <div className={`w-48 h-32 rounded-full -ml-12 blur-sm relative ${isDark ? 'bg-slate-700 shadow-[inset_0_8px_12px_rgba(255,255,255,0.05)]' : 'bg-amber-50 shadow-[inset_0_-8px_12px_rgba(251,191,36,0.2)]'}`} />
            <div className={`w-40 h-28 rounded-full -ml-16 blur-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`} />
          </div>
          <div className="absolute top-[24%] left-0 flex items-end animate-drift-fast opacity-50 dark:opacity-25 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]" style={{ animationDelay: '-12s' }}>
            <div className={`w-44 h-20 rounded-full blur-md ${isDark ? 'bg-neutral-800' : 'bg-amber-100'}`} />
            <div className={`w-64 h-28 rounded-full -ml-16 blur-md ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
            <div className={`w-36 h-20 rounded-full -ml-20 blur-md ${isDark ? 'bg-neutral-800' : 'bg-amber-100'}`} />
          </div>
        </div>
        
        {/* Sun/Moon Orb */}
        <div
          className={`absolute top-16 right-12 md:top-24 md:right-36 rounded-full transition-all duration-1000 ease-in-out animate-orb ${
            isDark
              ? "w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-amber-300 via-yellow-100 to-white shadow-[0_0_90px_30px_rgba(251,191,36,0.4)]"
              : "w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_120px_50px_rgba(245,158,11,0.55)]"
          }`}
        >
          <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? "opacity-20" : "opacity-0"}`}>
            <div className="absolute top-5 left-6 w-5 h-5 bg-amber-900/30 rounded-full blur-[1px]" />
            <div className="absolute bottom-6 left-8 w-6 h-5 bg-amber-900/30 rounded-full blur-[1px]" />
            <div className="absolute top-10 right-6 w-4 h-4 bg-amber-900/30 rounded-full blur-[1px]" />
          </div>
        </div>

        {/* Horizon and Terrain lines */}
        <div className={`absolute bottom-28 left-0 right-0 h-[3px] transition-all duration-1000 z-10 ${
          isDark ? "bg-amber-200/20 shadow-[0_0_25px_3px_rgba(253,230,138,0.3)]" : "bg-yellow-300/40 shadow-[0_0_35px_5px_rgba(251,191,36,0.4)]"
        }`} />

        <div className={`absolute bottom-24 left-0 right-0 h-56 transition-all duration-1000 ${isDark ? "opacity-60" : "opacity-45"}`}>
          <div
            className={`absolute inset-0 bg-gradient-to-b transition-all duration-1000 ${
              isDark ? "from-slate-900 via-indigo-950 to-neutral-950" : "from-sky-600 via-sky-700 to-indigo-900"
            }`}
            style={{ clipPath: "polygon(0% 100%, 0% 60%, 15% 32%, 30% 58%, 48% 22%, 68% 65%, 84% 38%, 100% 62%, 100% 100%)" }}
          />
          <div className="absolute bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-white/10 dark:from-indigo-500/5 to-transparent blur-sm z-0" />
          <div
            className={`absolute inset-0 opacity-90 bg-gradient-to-b transition-all duration-1000 ${
              isDark ? "from-indigo-950 via-slate-950 to-neutral-950" : "from-sky-700 via-teal-800 to-indigo-950"
            }`}
            style={{ clipPath: "polygon(0% 100%, 0% 74%, 20% 46%, 38% 68%, 56% 42%, 74% 78%, 88% 56%, 100% 72%, 100% 100%)" }}
          />
        </div>

        {/* Forest Outline */}
        <div className={`absolute bottom-24 left-0 right-0 h-16 transition-all duration-1000 z-10 ${isDark ? "opacity-75" : "opacity-55"}`}>
          <div
            className={`absolute inset-0 bg-gradient-to-b transition-all duration-1000 ${
              isDark ? "from-neutral-950 via-slate-950 to-zinc-950" : "from-teal-950 via-emerald-950 to-slate-950"
            }`}
            style={{
              clipPath: `polygon(
                0% 100%, 0% 85%, 2% 58%, 3% 85%, 5% 60%, 7% 88%, 9% 52%, 11% 78%, 13% 55%, 15% 82%, 17% 62%, 19% 88%, 
                22% 48%, 24% 78%, 26% 55%, 28% 82%, 31% 60%, 34% 88%, 36% 48%, 39% 78%, 42% 58%, 45% 82%, 48% 52%, 51% 88%, 
                54% 46%, 57% 80%, 60% 55%, 63% 82%, 66% 58%, 69% 88%, 72% 50%, 75% 78%, 78% 54%, 81% 82%, 84% 60%, 87% 88%, 
                89% 48%, 91% 75%, 94% 52%, 96% 82%, 98% 56%, 100% 82%, 100% 100%
              )`
            }}
          />
        </div>

        {/* Shimmering Sea Floor */}
        <div className={`absolute bottom-0 left-0 right-0 h-28 border-t transition-all duration-1000 z-10 ${
          isDark ? "bg-gradient-to-b from-slate-900 via-slate-950 to-black border-white/5" : "bg-gradient-to-b from-sky-600 via-indigo-800 to-slate-950 border-sky-400/20"
        }`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-full opacity-40 blur-lg bg-gradient-to-r from-transparent ${
            isDark ? "via-amber-200" : "via-yellow-300"
          } to-transparent animate-shimmer`} />
        </div>
      </div>

      {/* Precipitation Overlays */}
      {isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {RAIN_MAP.map((drop, idx) => (
            <div
              key={idx}
              className="absolute bg-gradient-to-b from-transparent via-blue-200/50 to-white/70 animate-rain-stream"
              style={{
                left: drop.left,
                height: drop.height,
                width: "1px",
                opacity: drop.opacity,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>
      )}

      {isSnowy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {SNOW_MAP.filter((_, idx) => !isLightSnow || idx % 2 === 0).map((flake, idx) => (
            <div
              key={idx}
              className="absolute bg-white rounded-full animate-snow"
              style={{
                top: "-20px",
                left: flake.left,
                width: isLightSnow ? "3px" : flake.size,
                height: isLightSnow ? "3px" : flake.size,
                animationDelay: flake.delay,
                animationDuration: isLightSnow ? "14s" : flake.duration,
                filter: flake.blur !== "0px" ? `blur(${flake.blur})` : "none"
              }}
            />
          ))}
        </div>
      )}

      {isIcy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {ICE_MAP.map((shard, idx) => (
            <div
              key={idx}
              className="absolute bg-gradient-to-b from-cyan-200/60 to-transparent animate-ice"
              style={{
                top: "-40px",
                left: shard.left,
                width: "1.5px",
                height: shard.length,
                animationDelay: shard.delay,
                animationDuration: shard.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Layout Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 min-h-screen flex flex-col justify-between">
        <div>
          
          {/* Header Module */}
          <header className={`mb-8 p-4 md:p-5 rounded-3xl border backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border-t-white/20 transition-all duration-500 ${
            isDark 
              ? "bg-slate-900/40 border-white/5 shadow-black/40" 
              : "bg-white/40 border-slate-200/60 shadow-slate-200/50"
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Branding Stack */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`relative p-0.5 rounded-2xl border shadow-inner transition-transform duration-500 hover:rotate-3 group ${
                  isDark ? "bg-gradient-to-b from-white/10 to-transparent border-white/10" : "bg-gradient-to-b from-white/80 to-slate-200/30 border-slate-300/40"
                }`}>
                  <img src={logo} alt="The Khmer Weather Logo" className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
                </div>
                
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className={`text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${
                      isDark ? "from-white via-slate-100 to-slate-300" : "from-slate-950 via-slate-900 to-slate-800"
                    }`}>
                      The Khmer Weather
                    </h1>
                    <div className="relative flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-orange-500/30 rounded-full shadow-sm animate-pulse-glow">
                      <Cpu size={10} className="text-orange-500" />
                      <span className="text-orange-500 text-[9px] font-black tracking-widest uppercase">FAST</span>
                    </div>
                  </div>
                  <p className={`text-[10px] md:text-xs tracking-wider uppercase opacity-80 ${isDark ? "text-cyan-400" : "text-indigo-600"}`}>
                    helps users quickly check current conditions
                  </p>
                </div>
              </div>

              {/* Functional Controls Layer */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                <div className={`hidden md:flex flex-col items-end text-right mr-2`}>
                  <span className={`text-[10px] font-bold tracking-widest opacity-40 uppercase ${isDark ? "text-white" : "text-black"}`}>Dark-Mood</span>
                  <span className={`text-xs font-black tracking-wide ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Operational</span>
                </div>
                
                <button 
                  onClick={toggleThemeMode} 
                  className={`p-3.5 rounded-2xl border shadow-md backdrop-blur-md transition-all duration-300 active:scale-95 relative overflow-hidden group ${
                    isDark 
                      ? "bg-slate-950/40 border-white/10 text-amber-300 hover:bg-slate-900/60" 
                      : "bg-white/90 border-slate-300/60 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                    isDark ? "from-amber-500/10 via-yellow-400/5 to-transparent" : "from-indigo-500/5 via-sky-400/10 to-transparent"
                  }`} />
                  <div className="relative z-10 transition-transform duration-500 group-hover:rotate-45">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </div>
                </button>
              </div>

            </div>
          </header>

          {/* Search Module */}
          <div className="max-w-3xl mx-auto mb-7">
            <SearchBar onSearch={handleSearch} isLoading={loading} themeMode={themeMode} />
          </div>

          {/* History Badges */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10 px-2 animate-fadeIn">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center mr-1 ${isDark ? "text-white/40" : "text-slate-600"}`}>
                <History size={12} className="inline mr-1.5 opacity-80" /> Recent:
              </span>
              {searchHistory.map((city, index) => (
                <button
                  key={index}
                  onClick={() => loadWeatherData(city)}
                  className={`px-3.5 py-1.5 border rounded-full text-xs font-bold tracking-wide transition-all duration-200 backdrop-blur-md active:scale-95 shadow-sm ${
                    isDark ? "bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10" : "bg-white/80 border-slate-200 text-slate-900 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  {city}
                </button>
              ))}
              <button onClick={handleClearHistory} className="p-2 bg-rose-500/90 hover:bg-rose-600 text-white rounded-full transition-all duration-200 active:scale-90 shadow-sm ml-1" title="Clear History">
                <Trash2 size={12} />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* RE-DESIGNED DASHBOARD FRAMEWORK (Centered & Smaller Layout) */}
          {/* ========================================================================= */}
          <main className="w-full flex justify-center px-1 md:px-4">
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Loading themeMode={themeMode} />
              </div>
            ) : error ? (
              <div className="max-w-xl mx-auto py-8">
                <Error message={error} onRetry={() => loadWeatherData(currentCity)} themeMode={themeMode} />
              </div>
            ) : (
              /* Max width explicitly locked down to 5xl to shrink cards down on large desktops */
              <div className="w-full max-w-5xl space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                  
                  {/* Weather Card Wrapper */}
                  <div className="lg:col-span-1 flex flex-col">
                    <div className="h-full backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                      <WeatherCard weather={weather} unit={unit} onToggleUnit={handleToggleUnit} themeMode={themeMode} />
                    </div>
                  </div>
                  
                  {/* Weather Details Wrapper */}
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="h-full backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                      <WeatherDetails weather={weather} unit={unit} themeMode={themeMode} />
                    </div>
                  </div>

                </div>
                
                {/* 7-Day Forecast Wrapper */}
                <div className="w-full backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                  <ForecastList forecastData={forecast} unit={unit} themeMode={themeMode} />
                </div>
              </div>
            )}
          </main>
          {/* ========================================================================= */}

        </div>

        {/* Footer */}
        <footer className={`mt-16 pt-6 border-t backdrop-blur-[1px] transition-colors duration-1000 ${isDark ? "border-white/5 text-white/40" : "border-slate-200 text-slate-500"}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium tracking-wider uppercase">
            <p className="select-none">&copy; {new Date().getFullYear()} The Khmer Weather. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span>Created by</span>
              <span className={`font-bold tracking-widest ${isDark ? "text-amber-300" : "text-slate-900"}`}>SOKKHEN</span>
              <span className="opacity-30">|</span>
              <span className="text-[10px] opacity-70 select-none">Powered by OpenWeather</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}