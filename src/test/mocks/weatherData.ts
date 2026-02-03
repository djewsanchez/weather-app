import type { WeatherData, WeatherApiResponse } from "../../types/weather";

export const mockWeatherData: WeatherData = {
  city: "London",
  country: "GB",
  temperature: 15,
  feelsLike: 13,
  condition: "Clouds",
  description: "scattered clouds",
  humidity: 72,
  windSpeed: 18,
  icon: "03d",
};

export const mockApiResponse: WeatherApiResponse = {
  name: "London",
  sys: { country: "GB" },
  main: {
    temp: 15.2,
    feels_like: 13.4,
    humidity: 72,
  },
  weather: [
    {
      main: "Clouds",
      description: "scattered clouds",
      icon: "03d",
    },
  ],
  wind: { speed: 5.0 },
};

export const mockErrorResponse = {
  cod: "404",
  message: "city not found",
};
