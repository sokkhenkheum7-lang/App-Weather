import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, MapPin, X, Command } from 'lucide-react';

const locationSuggestionsList = [
  { city: "Phnom Penh", region: "Chaktomuk", country: "Cambodia", display: "Phnom Penh, Cambodia" },
  { city: "Siem Reap", region: "Siem Reap Province", country: "Cambodia", display: "Siem Reap, Cambodia" },
  { city: "Sihanoukville", region: "Preah Sihanouk Province", country: "Cambodia", display: "Sihanoukville, Cambodia" },
  { city: "Battambang", region: "Battambang Province", country: "Cambodia", display: "Battambang, Cambodia" },
  { city: "Kampot", region: "Kampot Province", country: "Cambodia", display: "Kampot, Cambodia" },
  { city: "London", region: "Greater London", country: "United Kingdom", display: "London, Greater London, UK" },
  { city: "Paris", region: "Île-de-France", country: "France", display: "Paris, Île-de-France, France" },
  { city: "New York", region: "New York State", country: "United States", display: "New York, NY, USA" },
  { city: "Tokyo", region: "Kanto", country: "Japan", display: "Tokyo, Kanto, Japan" },
  { city: "Sydney", region: "New South Wales", country: "Australia", display: "Sydney, NSW, Australia" },
  { city: "Bangkok", region: "Krung Thep Maha Nakhon", country: "Thailand", display: "Bangkok, Thailand" }
];

export default function SearchBar({ onSearch, isLoading, themeMode }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length > 0) {
      const filtered = locationSuggestionsList.filter(item => 
        item.city.toLowerCase().includes(val.toLowerCase()) ||
        item.region.toLowerCase().includes(val.toLowerCase()) ||
        item.country.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (selectedLocation) => {
    setQuery(selectedLocation.display);
    setShowDropdown(false);
    onSearch(selectedLocation.city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto mb-8 relative z-50 p-1 rounded-3xl transition-all duration-500">
      
      {/* Dynamic Glow Background Effect to elevate the glass feel */}
      <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-30 transition-all duration-500 group-focus-within:opacity-60 ${
        isDark ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400'
      }`} />

      <form onSubmit={handleSubmit} className="relative flex items-center group">
        {/* Search Icon Adornment */}
        <div className="absolute left-5 z-10 flex items-center justify-center pointer-events-none">
          <Search 
            size={22} 
            className={`transition-all duration-300 ${
              isDark 
                ? 'text-slate-400 group-focus-within:text-sky-400 group-focus-within:scale-110' 
                : 'text-slate-500 group-focus-within:text-blue-600 group-focus-within:scale-110'
            }`} 
          />
        </div>

        {/* Input Field - Styled like realistic fine glass */}
        <input 
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length > 0 && setShowDropdown(true)}
          placeholder="Search for a city, region, or country..."
          disabled={isLoading}
          className={`
            w-full pl-14 pr-12 py-4.5 rounded-2xl outline-none 
            transition-all duration-300 text-base md:text-lg font-medium
            backdrop-blur-2xl border shadow-2xl
            ${isDark 
              ? 'bg-slate-900/40 hover:bg-slate-900/50 text-white placeholder-slate-400/70 border-white/10 focus:border-white/20 focus:ring-4 focus:ring-sky-500/10' 
              : 'bg-white/40 hover:bg-white/50 text-slate-800 placeholder-slate-500/70 border-white/40 focus:border-white/60 focus:ring-4 focus:ring-blue-500/10'
            }
          `}
        />
        
        {/* Clear Button */}
        <div className="absolute right-4 z-10 flex items-center">
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-md ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white border border-white/5' 
                  : 'bg-black/5 hover:bg-black/10 text-slate-600 hover:text-slate-900 border border-black/5'
              }`}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown - Matching Frosty Glass */}
      <div 
        className={`
          absolute top-[calc(100%+14px)] left-0 right-0 rounded-2xl border overflow-hidden
          backdrop-blur-3xl transition-all duration-300 origin-top shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]
          ${showDropdown ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}
          ${isDark 
            ? 'bg-slate-950/60 border-white/10 text-slate-200' 
            : 'bg-white/60 border-white/40 text-slate-800'
          }
        `}
      >
        {query.trim().length > 0 && (
          <div className="flex flex-col">
            {/* Dropdown Header */}
            <div className={`px-5 py-3.5 flex items-center justify-between border-b backdrop-blur-md ${
              isDark ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.01]'
            }`}>
              <div className="flex items-center gap-2">
                <Command size={14} className={isDark ? 'text-sky-400' : 'text-blue-600'} />
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Locations
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-black/5 border-black/5 text-slate-600'
              }`}>
                {suggestions.length} {suggestions.length === 1 ? 'Result' : 'Results'}
              </span>
            </div>

            {/* Results List */}
            {suggestions.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {suggestions.map((loc, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(loc)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 
                        flex items-center justify-between group border border-transparent
                        ${isDark 
                          ? 'hover:bg-white/10 hover:border-white/5 focus:bg-white/10' 
                          : 'hover:bg-white/60 hover:border-white/40 focus:bg-white/60'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-white/5 border border-white/5 group-hover:bg-sky-500/10 group-hover:text-sky-400 text-slate-400' 
                            : 'bg-black/5 border border-black/5 group-hover:bg-blue-500/10 group-hover:text-blue-600 text-slate-500'
                        }`}>
                          <MapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm md:text-base font-semibold transition-colors ${
                            isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {loc.city}
                          </span>
                          <span className={`text-xs mt-0.5 font-normal ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {loc.region}, {loc.country}
                          </span>
                        </div>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`transition-all duration-300 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                          isDark ? 'text-sky-400' : 'text-blue-600'
                        }`} 
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              /* Empty State Crystal Spec */
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <div className={`p-4 rounded-full mb-3 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                  <Search size={26} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                </div>
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  No locations found for "{query}"
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Try checking the spelling or searching for a different city.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}