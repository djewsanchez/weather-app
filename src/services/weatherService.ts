import type { WeatherData, WeatherApiResponse } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const response = await fetch(
    `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "City not found. Please check the spelling and try again.",
      );
    } else if (response.status === 401) {
      throw new Error("Invalid API key. Please check your configuration.");
    }
    throw new Error("Failed to fetch weather data. Please try again later.");
  }

  const data: WeatherApiResponse = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    icon: data.weather[0].icon,
  };
};
