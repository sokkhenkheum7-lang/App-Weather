import React, { useState, useEffect } from "react";
import {
  CloudRain,
  Sun,
  Moon,
  History,
  Trash2,
} from "lucide-react";

import { weatherApi } from "./services/weatherApi";
import Loading from "./components/Loading";
import Error from "./components/Error";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import ForecastList from "./components/ForecastList";

// Premium dense star field mapping with variant depth, scale, and twinkling frequencies
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

// Premium snowfall offset layout configuration
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

// Premium freezing ice/sleet shard mapping
const ICE_MAP = [
  { left: "10%", length: "14px", delay: "0.2s", duration: "1.8s" },
  { left: "30%", length: "22px", delay: "1.1s", duration: "1.4s" },
  { left: "52%", length: "16px", delay: "0.5s", duration: "2.2s" },
  { left: "75%", length: "25px", delay: "1.6s", duration: "1.6s" },
  { left: "90%", length: "18px", delay: "0.8s", duration: "2.0s" }
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
    } catch (error) {
      console.warn("Failed to load history:", error);
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
    } catch (error) {
      console.warn(error);
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
      } catch (error) {
        console.warn("Failed to save history:", error);
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

      const fontcastData = await weatherApi.getForecastByCoords(
        weatherData.coord.lat,
        weatherData.coord.lon,
        unit
      );
      setForecast(fontcastData);
    } catch (error) {
      setError(error.message || "Failed to load weather data.");
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
        return "from-slate-900 via-slate-950 to-indigo-950/40 text-slate-200";
      }
      return "from-zinc-900 via-slate-900 to-indigo-950 text-white";
    }
    if (condition.includes("rain")) {
      return "from-slate-950 via-slate-900 to-blue-950/70 text-slate-100";
    }
    return "from-slate-950 via-indigo-950 to-slate-900 text-white";
  };

  // Weather condition string safety evaluations
  const mainCondition = weather?.weather?.[0]?.main?.toLowerCase() || "";
  const descCondition = weather?.weather?.[0]?.description?.toLowerCase() || "";

  const isDark = themeMode === "dark";

  const isRainy = themeMode === "dark" && mainCondition.includes("rain") && !descCondition.includes("freezing");
  
  // Refined snow evaluations splitting heavy and light states
  const isSnowy = themeMode === "dark" && mainCondition.includes("snow");
  const isLightSnow = isSnowy && descCondition.includes("light");
  const isHeavySnow = isSnowy && !descCondition.includes("light");

  // Freezing Ice / Sleet evaluations
  const isIcy = themeMode === "dark" && (mainCondition.includes("ice") || descCondition.includes("freezing") || descCondition.includes("sleet") || descCondition.includes("hail"));

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 bg-gradient-to-b ${getAmbientClass()}`}>
      
      {/* Top-Grade Atmospheric Keyframe Animations */}
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
        @keyframes fall {
          0% { transform: translateY(-120px) translateX(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(30px); opacity: 0; }
        }
        @keyframes fallSnow {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(45px) rotate(360deg); opacity: 0; }
        }
        @keyframes fallIce {
          0% { transform: translateY(-40px) translateX(0) skewX(-5deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translateY(105vh) translateX(15px) skewX(-5deg); opacity: 0; }
        }
        .animate-drift-slow { animation: drift 90s linear infinite; }
        .animate-drift-med { animation: drift 60s linear infinite; }
        .animate-drift-fast { animation: drift 35s linear infinite; }
        .animate-twinkle { animation: twinkle 3.5s ease-in-out infinite; }
        .animate-shimmer { animation: oceanShimmer 7s ease-in-out infinite; }
        .animate-orb { animation: floatOrb 5s ease-in-out infinite; }
        .animate-fall { animation: fall 2.5s linear infinite; }
        .animate-snow { animation: fallSnow linear infinite forwards; }
        .animate-ice { animation: fallIce linear infinite; }
      `}</style>

      {/* Dynamic Scenery Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        
        {/* Deep Field Star System (Visible strictly on Dark Mode) */}
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

        {/* Cinematic Thick Volumetric Clouds Layer */}
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
        
        {/* Cinematic Yellow Moonlight (Dark) / Radiating Sunlight (Light) */}
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

        {/* Dynamic Sea Glow/Reflection Horizon Line */}
        <div className={`absolute bottom-28 left-0 right-0 h-[3px] transition-all duration-1000 z-10 ${
          isDark ? "bg-amber-200/20 shadow-[0_0_25px_3px_rgba(253,230,138,0.3)]" : "bg-yellow-300/40 shadow-[0_0_35px_5px_rgba(251,191,36,0.4)]"
        }`} />

        {/* Structural Mountain Layer */}
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

        {/* Dense Pine Forest Silhouette Layer */}
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

        {/* Sea Layer with active shifting light reflections */}
        <div className={`absolute bottom-0 left-0 right-0 h-28 border-t transition-all duration-1000 z-10 ${
          isDark ? "bg-gradient-to-b from-slate-900 via-slate-950 to-black border-white/5" : "bg-gradient-to-b from-sky-600 via-indigo-800 to-slate-950 border-sky-400/20"
        }`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-full opacity-40 blur-lg bg-gradient-to-r from-transparent ${
            isDark ? "via-amber-200" : "via-yellow-300"
          } to-transparent animate-shimmer`} />
        </div>
      </div>

      {/* Falling Rain Overlay */}
      {isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-[1px] h-20 bg-gradient-to-b from-transparent to-white/60 animate-fall" />
            <div className="absolute top-0 left-2/4 w-[1.5px] h-24 bg-gradient-to-b from-transparent to-white/70 animate-fall [animation-delay:0.8s]" />
            <div className="absolute top-0 left-3/4 w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50 animate-fall [animation-delay:0.1s]" />
          </div>
        </div>
      )}

      {/* Dynamic Falling Snow Overlay (Adapts density for Light Snow vs Regular/Heavy Snow) */}
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
                animationDuration: isLightSnow ? "14s" : flake.duration, // Slower glide for light snow
                filter: flake.blur !== "0px" ? `blur(${flake.blur})` : "none"
              }}
            />
          ))}
        </div>
      )}

      {/* Freezing Shimmering Ice Overlay */}
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

      {/* Primary UI Application Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 min-h-screen flex flex-col justify-between">
        <div>
          {/* Enhanced Header Design */}
          <header className={`flex justify-between items-center mb-8 border-b pb-5 backdrop-blur-[2px] transition-all duration-300 ${isDark ? "border-white/10" : "border-slate-300/80"}`}>
            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-2xl border shadow-md backdrop-blur-md transition-transform duration-500 hover:scale-105 ${
                isDark ? "bg-white/10 border-white/20 text-amber-300" : "bg-white/80 border-slate-300/60 text-slate-900"
              }`}>
                <CloudRain size={26} className="animate-pulse" />
              </div>

              <div>
                <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center ${isDark ? "text-white" : "text-slate-950"}`}>
                  NIMBUS
                  <span className="text-white text-[9px] font-black tracking-widest px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-md ml-2.5 shadow-sm">
                    PRO
                  </span>
                </h1>
                <p className={`text-[10px] md:text-xs font-medium tracking-wider uppercase mt-0.5 ${isDark ? "text-white/40" : "text-slate-600"}`}>
                  Glassmorphism Weather Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={toggleThemeMode}
              className={`p-3 rounded-2xl border shadow-md backdrop-blur-md transition-all duration-300 active:scale-95 hover:shadow-lg ${
                isDark 
                  ? "bg-white/10 border-white/10 text-amber-300 hover:bg-white/15" 
                  : "bg-white/90 border-slate-300/70 text-slate-950 hover:bg-slate-50"
              }`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </header>

          {/* Search Management Module */}
          <div className="max-w-3xl mx-auto mb-6">
            <SearchBar onSearch={handleSearch} isLoading={loading} themeMode={themeMode} />
          </div>

          {/* Redesigned Search History Badges */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10 px-2 animate-fadeIn">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center mr-1 ${isDark ? "text-white/40" : "text-slate-600"}`}>
                <History size={12} className="inline mr-1.5 opacity-80" />
                Recent:
              </span>

              {searchHistory.map((city, index) => (
                <button
                  key={index}
                  onClick={() => loadWeatherData(city)}
                  className={`px-3.5 py-1.5 border rounded-full text-xs font-bold tracking-wide transition-all duration-200 backdrop-blur-md active:scale-95 shadow-sm ${
                    isDark 
                      ? "bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10" 
                      : "bg-white/80 border-slate-200 text-slate-900 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  {city}
                </button>
              ))}

              <button 
                onClick={handleClearHistory} 
                className="p-2 bg-rose-500/90 hover:bg-rose-600 text-white rounded-full transition-all duration-200 active:scale-90 shadow-sm ml-1"
                title="Clear History"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}

          {/* Responsive Dashboard Layout Frame */}
          <main className="w-full">
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Loading themeMode={themeMode} />
              </div>
            ) : error ? (
              <div className="max-w-xl mx-auto py-8">
                <Error message={error} onRetry={() => loadWeatherData(currentCity)} themeMode={themeMode} />
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                {/* Upper Metrics Grid Splitting Main Card & Auxiliary Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  <div className="lg:col-span-1 flex flex-col">
                    <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <WeatherCard weather={weather} unit={unit} onToggleUnit={handleToggleUnit} themeMode={themeMode} />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <WeatherDetails weather={weather} unit={unit} themeMode={themeMode} />
                    </div>
                  </div>
                </div>

                {/* Lower Timeline Frame */}
                <div className="w-full backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <ForecastList forecastData={forecast} unit={unit} themeMode={themeMode} />
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Minimal Subtle Footer branding */}
        <footer className={`mt-16 pt-6 border-t backdrop-blur-[1px] transition-colors duration-1000 ${
          isDark ? "border-white/5 text-white/40" : "border-slate-200 text-slate-500"
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium tracking-wider uppercase">
            <p className="select-none">
              &copy; {new Date().getFullYear()} NIMBUS PRO. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <span>Created by</span>
              <span className={`font-bold tracking-widest ${isDark ? "text-amber-300" : "text-slate-900"}`}>
                SOKKHEN
              </span>
              <span className="opacity-30">|</span>
              <span className="text-[10px] opacity-70 select-none">Powered by OpenWeather</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}