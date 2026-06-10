const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

if (!API_KEY) {
  throw new Error("❌ Missing VITE_OPENWEATHER_API_KEY in .env file");
}

/* =========================
   Base Fetch Helper
========================= */
async function fetchWeather(url) {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "❌ Weather API request failed");
  }

  return data;
}

/* =========================
   Helpers
========================= */
const encode = (value) => encodeURIComponent(value.trim());

const groupForecast = (list) => {
  const grouped = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!grouped[date]) {
      grouped[date] = {
        dt: item.dt,
        temps: [],
        weather: item.weather,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
      };
    }

    grouped[date].temps.push(item.main.temp);

    // Prefer midday forecast
    if (item.dt_txt.includes("12:00:00")) {
      grouped[date].weather = item.weather;
      grouped[date].dt = item.dt;
    }
  });

  return Object.values(grouped)
    .map((day) => ({
      dt: day.dt,
      temp: {
        min: Math.min(...day.temps),
        max: Math.max(...day.temps),
      },
      weather: day.weather,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
    }))
    .slice(0, 5);
};

/* =========================
   API
========================= */
export const weatherApi = {
  // 🔍 Search locations worldwide
  async searchLocations(query) {
    if (!query.trim()) return [];

    const url = `${GEO_URL}/direct?q=${encode(query)}&limit=5&appid=${API_KEY}`;

    try {
      const data = await fetchWeather(url);

      return data.map((item) => ({
        city: item.name,
        region: item.state || "",
        country: item.country,
        display: `${item.name}${item.state ? `, ${item.state}` : ""}, ${
          item.country
        }`,
      }));
    } catch (error) {
      console.error("Geocoding Error:", error);
      return [];
    }
  },

  // 🌤️ Current weather by city
  async getWeatherByCity(city, units = "metric") {
    const url = `${BASE_URL}/weather?q=${encode(city)}&appid=${API_KEY}&units=${units}`;
    return fetchWeather(url);
  },

  // 📅 Forecast by city
  async getForecast(city, units = "metric") {
    const url = `${BASE_URL}/forecast?q=${encode(city)}&units=${units}&appid=${API_KEY}`;
    const data = await fetchWeather(url);
    return groupForecast(data.list);
  },

  // 📍 Weather by coordinates
  async getWeatherByCoords(lat, lon, units = "metric") {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    return fetchWeather(url);
  },

  // 📍 Forecast by coordinates
  async getForecastByCoords(lat, lon, units = "metric") {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    const data = await fetchWeather(url);
    return groupForecast(data.list);
  },
};