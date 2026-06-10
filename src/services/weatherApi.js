// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// const BASE_URL = "https://api.openweathermap.org/data/2.5";

// export const weatherApi = {
//   // Current weather by city
//   async getWeatherByCity(city, units = "metric") {
//     const response = await fetch(
//   `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
// );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to fetch weather");
//     }

//     return data;
//   },

//   // Forecast by city
// async getForecast(city, units = "metric") {
//   const response = await fetch(
//     `${BASE_URL}/forecast?q=${encodeURIComponent(
//       city.trim()
//     )}&units=${units}&appid=${API_KEY}`
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch forecast");
//   }

//   const grouped = {};

//   data.list.forEach((item) => {
//     const date = item.dt_txt.split(" ")[0];

//     if (!grouped[date]) {
//       grouped[date] = {
//         dt: item.dt,
//         temps: [],
//         weather: item.weather,
//       };
//     }

//     grouped[date].temps.push(item.main.temp);

//     if (item.dt_txt.includes("12:00:00")) {
//       grouped[date].weather = item.weather;
//       grouped[date].dt = item.dt;
//     }
//   });

//   return Object.values(grouped)
//     .map((day) => ({
//       dt: day.dt,
//       temp: {
//         min: Math.min(...day.temps),
//         max: Math.max(...day.temps),
//       },
//       weather: day.weather,
//     }))
//     .slice(0, 5);
// },

//   // Current weather by coordinates
//   async getWeatherByCoords(lat, lon, units = "metric") {
//     const response = await fetch(
//       `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.message || "Failed to fetch weather for current location"
//       );
//     }

//     return data;
//   },

//   // Forecast by coordinates
//   async getForecastByCoords(lat, lon, units = "metric") {
//     const response = await fetch(
//       `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.message || "Failed to fetch forecast for current location"
//       );
//     }

//     const dailyForecasts = [];
//     const seenDates = new Set();

//     data.list.forEach((item) => {
//       const dateStr = new Date(item.dt * 1000).toDateString();

//       if (!seenDates.has(dateStr)) {
//         seenDates.add(dateStr);

//         dailyForecasts.push({
//           dt: item.dt,
//           temp: {
//             day: item.main.temp,
//             min: item.main.temp_min,
//             max: item.main.temp_max,
//           },
//           weather: item.weather,
//           humidity: item.main.humidity,
//           wind_speed: item.wind.speed,
//         });
//       }
//     });

//     return dailyForecasts.slice(0, 7);
//   },
// };