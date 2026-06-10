import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, MapPin, X, Command } from 'lucide-react';
import { weatherApi } from '../services/weatherApi';

// countries.js
export const locationSuggestionsList = [
  // ==========================================
  // CAMBODIA (All 25 Provinces & Municipalities)
  // ==========================================
  { city: "Phnom Penh", region: "Phnom Penh", country: "Cambodia", display: "Phnom Penh, Cambodia" },
  { city: "Siem Reap", region: "Siem Reap", country: "Cambodia", display: "Siem Reap, Cambodia" },
  { city: "Battambang", region: "Battambang", country: "Cambodia", display: "Battambang, Cambodia" },
  { city: "Sihanoukville", region: "Preah Sihanouk", country: "Cambodia", display: "Sihanoukville, Preah Sihanouk, Cambodia" },
  { city: "Kampot", region: "Kampot", country: "Cambodia", display: "Kampot, Cambodia" },
  { city: "Kampong Cham", region: "Kampong Cham", country: "Cambodia", display: "Kampong Cham, Cambodia" },
  { city: "Kampong Chhnang", region: "Kampong Chhnang", country: "Cambodia", display: "Kampong Chhnang, Cambodia" },
  { city: "Kampong Speu", region: "Kampong Speu", country: "Cambodia", display: "Kampong Speu, Cambodia" },
  { city: "Kampong Thom", region: "Kampong Thom", country: "Cambodia", display: "Kampong Thom, Cambodia" },
  { city: "Kandal", region: "Kandal", country: "Cambodia", display: "Kandal, Cambodia" },
  { city: "Kep", region: "Kep", country: "Cambodia", display: "Kep, Cambodia" },
  { city: "Koh Kong", region: "Koh Kong", country: "Cambodia", display: "Koh Kong, Cambodia" },
  { city: "Kratie", region: "Kratie", country: "Cambodia", display: "Kratie, Cambodia" },
  { city: "Mondulkiri", region: "Mondulkiri", country: "Cambodia", display: "Mondulkiri, Cambodia" },
  { city: "Oddar Meanchey", region: "Oddar Meanchey", country: "Cambodia", display: "Oddar Meanchey, Cambodia" },
  { city: "Pailin", region: "Pailin", country: "Cambodia", display: "Pailin, Cambodia" },
  { city: "Preah Vihear", region: "Preah Vihear", country: "Cambodia", display: "Preah Vihear, Cambodia" },
  { city: "Prey Veng", region: "Prey Veng", country: "Cambodia", display: "Prey Veng, Cambodia" },
  { city: "Pursat", region: "Pursat", country: "Cambodia", display: "Pursat, Cambodia" },
  { city: "Ratanakiri", region: "Ratanakiri", country: "Cambodia", display: "Ratanakiri, Cambodia" },
  { city: "Stung Treng", region: "Stung Treng", country: "Cambodia", display: "Stung Treng, Cambodia" },
  { city: "Svay Rieng", region: "Svay Rieng", country: "Cambodia", display: "Svay Rieng, Cambodia" },
  { city: "Takeo", region: "Takeo", country: "Cambodia", display: "Takeo, Cambodia" },
  { city: "Tboung Khmum", region: "Tboung Khmum", country: "Cambodia", display: "Tboung Khmum, Cambodia" },
  { city: "Banteay Meanchey", region: "Banteay Meanchey", country: "Cambodia", display: "Banteay Meanchey, Cambodia" },

  // ==========================================
  // ASIA & REGIONAL HUBS
  // ==========================================
  { city: "Bangkok", region: "Central Thailand", country: "Thailand", display: "Bangkok, Thailand" },
  { city: "Chiang Mai", region: "Chiang Mai", country: "Thailand", display: "Chiang Mai, Thailand" },
  { city: "Phuket", region: "Phuket", country: "Thailand", display: "Phuket, Thailand" },
  { city: "Pattaya", region: "Chon Buri", country: "Thailand", display: "Pattaya, Chon Buri, Thailand" },
  { city: "Surat Thani", region: "Surat Thani", country: "Thailand", display: "Surat Thani (Koh Samui), Thailand" },
  { city: "Krabi", region: "Krabi", country: "Thailand", display: "Krabi, Thailand" },
  { city: "Hat Yai", region: "Songkhla", country: "Thailand", display: "Hat Yai, Songkhla, Thailand" },

  // ==========================================
  // VIETNAM (Major Provinces & Municipalities)
  // ==========================================
  { city: "Hanoi", region: "Red River Delta", country: "Vietnam", display: "Hanoi, Vietnam" },
  { city: "Ho Chi Minh City", region: "Southeast", country: "Vietnam", display: "Ho Chi Minh City, Vietnam" },
  { city: "Da Nang", region: "South Central Coast", country: "Vietnam", display: "Da Nang, Vietnam" },
  { city: "Nha Trang", region: "Khanh Hoa", country: "Vietnam", display: "Nha Trang, Khanh Hoa, Vietnam" },
  { city: "Hai Phong", region: "Red River Delta", country: "Vietnam", display: "Hai Phong, Vietnam" },
  { city: "Can Tho", region: "Mekong Delta", country: "Vietnam", display: "Can Tho, Vietnam" },

  // ==========================================
  // LAOS & MYANMAR
  // ==========================================
  { city: "Vientiane", region: "Prefecture", country: "Laos", display: "Vientiane, Laos" },
  { city: "Luang Prabang", region: "Luang Prabang", country: "Laos", display: "Luang Prabang, Laos" },
  { city: "Pakse", region: "Champasak", country: "Laos", display: "Pakse, Champasak, Laos" },
  { city: "Yangon", region: "Yangon Region", country: "Myanmar", display: "Yangon, Myanmar" },
  { city: "Mandalay", region: "Mandalay Region", country: "Myanmar", display: "Mandalay, Myanmar" },

  // ==========================================
  // MALAYSIA & SINGAPORE
  // ==========================================
  { city: "Kuala Lumpur", region: "Federal Territory", country: "Malaysia", display: "Kuala Lumpur, Malaysia" },
  { city: "Penang", region: "Penang", country: "Malaysia", display: "George Town, Penang, Malaysia" },
  { city: "Johor Bahru", region: "Johor", country: "Malaysia", display: "Johor Bahru, Johor, Malaysia" },
  { city: "Kota Kinabalu", region: "Sabah", country: "Malaysia", display: "Kota Kinabalu, Sabah, Malaysia" },
  { city: "Kuching", region: "Sarawak", country: "Malaysia", display: "Kuching, Sarawak, Malaysia" },
  { city: "Singapore", region: "Central Region", country: "Singapore", display: "Singapore" },

  // ==========================================
  // INDONESIA & PHILIPPINES
  // ==========================================
  { city: "Jakarta", region: "Java", country: "Indonesia", display: "Jakarta, Indonesia" },
  { city: "Denpasar", region: "Bali Province", country: "Indonesia", display: "Bali, Indonesia" },
  { city: "Surabaya", region: "East Java", country: "Indonesia", display: "Surabaya, East Java, Indonesia" },
  { city: "Medan", region: "North Sumatra", country: "Indonesia", display: "Medan, North Sumatra, Indonesia" },
  { city: "Manila", region: "Metro Manila", country: "Philippines", display: "Manila, Philippines" },
  { city: "Cebu City", region: "Central Visayas", country: "Philippines", display: "Cebu City, Philippines" },
  { city: "Davao City", region: "Davao Region", country: "Philippines", display: "Davao City, Philippines" },

  // ==========================================
  // EAST ASIA
  // ==========================================
  { city: "Tokyo", region: "Kanto", country: "Japan", display: "Tokyo, Kanto, Japan" },
  { city: "Osaka", region: "Kansai", country: "Japan", display: "Osaka, Japan" },
  { city: "Kyoto", region: "Kansai", country: "Japan", display: "Kyoto, Japan" },
  { city: "Sapporo", region: "Hokkaido", country: "Japan", display: "Sapporo, Hokkaido, Japan" },
  { city: "Seoul", region: "Sudogwon", country: "South Korea", display: "Seoul, South Korea" },
  { city: "Busan", region: "Yeongnam", country: "South Korea", display: "Busan, South Korea" },
  { city: "Beijing", region: "Hebei", country: "China", display: "Beijing, China" },
  { city: "Shanghai", region: "Shanghai", country: "China", display: "Shanghai, China" },
  { city: "Guangzhou", region: "Guangdong", country: "China", display: "Guangzhou, Guangdong, China" },
  { city: "Shenzhen", region: "Guangdong", country: "China", display: "Shenzhen, Guangdong, China" },
  { city: "Hong Kong", region: "Hong Kong", country: "China", display: "Hong Kong" },
  { city: "Taipei", region: "Northern Taiwan", country: "Taiwan", display: "Taipei, Taiwan" },

  // ==========================================
  // UNITED STATES (Major State Hubs)
  // ==========================================
  { city: "New York", region: "NY State", country: "United States", display: "New York, NY, USA" },
  { city: "Los Angeles", region: "California", country: "United States", display: "Los Angeles, CA, USA" },
  { city: "San Francisco", region: "California", country: "United States", display: "San Francisco, CA, USA" },
  { city: "Chicago", region: "Illinois", country: "United States", display: "Chicago, IL, USA" },
  { city: "Houston", region: "Texas", country: "United States", display: "Houston, TX, USA" },
  { city: "Miami", region: "Florida", country: "United States", display: "Miami, FL, USA" },
  { city: "Seattle", region: "Washington", country: "United States", display: "Seattle, WA, USA" },
  { city: "Washington D.C.", region: "District of Columbia", country: "United States", display: "Washington D.C., USA" },

  // ==========================================
  // CANADA & AMERICA (LATIN)
  // ==========================================
  { city: "Toronto", region: "Ontario", country: "Canada", display: "Toronto, ON, Canada" },
  { city: "Vancouver", region: "British Columbia", country: "Canada", display: "Vancouver, BC, Canada" },
  { city: "Montreal", region: "Quebec", country: "Canada", display: "Montreal, QC, Canada" },
  { city: "Mexico City", region: "Federal District", country: "Mexico", display: "Mexico City, Mexico" },
  { city: "São Paulo", region: "São Paulo State", country: "Brazil", display: "São Paulo, Brazil" },
  { city: "Rio de Janeiro", region: "Rio de Janeiro", country: "Brazil", display: "Rio de Janeiro, Brazil" },
  { city: "Buenos Aires", region: "Capital Federal", country: "Argentina", display: "Buenos Aires, Argentina" },

  // ==========================================
  // EUROPE (Major Provinces & Capitals)
  // ==========================================
  { city: "London", region: "Greater London", country: "United Kingdom", display: "London, UK" },
  { city: "Manchester", region: "Greater Manchester", country: "United Kingdom", display: "Manchester, UK" },
  { city: "Paris", region: "Île-de-France", country: "France", display: "Paris, France" },
  { city: "Lyon", region: "Auvergne-Rhône-Alpes", country: "France", display: "Lyon, France" },
  { city: "Berlin", region: "Berlin State", country: "Germany", display: "Berlin, Germany" },
  { city: "Munich", region: "Bavaria", country: "Germany", display: "Munich, Bavaria, Germany" },
  { city: "Rome", region: "Lazio", country: "Italy", display: "Rome, Italy" },
  { city: "Milan", region: "Lombardy", country: "Italy", display: "Milan, Italy" },
  { city: "Madrid", region: "Community of Madrid", country: "Spain", display: "Madrid, Spain" },
  { city: "Barcelona", region: "Catalonia", country: "Spain", display: "Barcelona, Catalonia, Spain" },
  { city: "Amsterdam", region: "North Holland", country: "Netherlands", display: "Amsterdam, Netherlands" },
  { city: "Brussels", region: "Brussels-Capital", country: "Belgium", display: "Brussels, Belgium" },
  { city: "Vienna", region: "Vienna State", country: "Austria", display: "Vienna, Austria" },
  { city: "Athens", region: "Attica", country: "Greece", display: "Athens, Greece" },
  { city: "Lisbon", region: "Lisbon District", country: "Portugal", display: "Lisbon, Portugal" },
  { city: "Stockholm", region: "Stockholm County", country: "Sweden", display: "Stockholm, Sweden" },

  // ==========================================
  // OCEANIA, SOUTH ASIA & MEA
  // ==========================================
  { city: "Sydney", region: "New South Wales", country: "Australia", display: "Sydney, NSW, Australia" },
  { city: "Melbourne", region: "Victoria", country: "Australia", display: "Melbourne, VIC, Australia" },
  { city: "Brisbane", region: "Queensland", country: "Australia", display: "Brisbane, QLD, Australia" },
  { city: "Auckland", region: "North Island", country: "New Zealand", display: "Auckland, New Zealand" },
  { city: "New Delhi", region: "Delhi", country: "India", display: "New Delhi, India" },
  { city: "Mumbai", region: "Maharashtra", country: "India", display: "Mumbai, India" },
  { city: "Dubai", region: "Emirate of Dubai", country: "United Arab Emirates", display: "Dubai, UAE" },
  { city: "Cairo", region: "Greater Cairo", country: "Egypt", display: "Cairo, Egypt" },
  { city: "Cape Town", region: "Western Cape", country: "South Africa", display: "Cape Town, South Africa" }
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