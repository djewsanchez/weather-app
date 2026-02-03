import { describe, it, expect } from "vitest";
import type { WeatherData, WeatherApiResponse } from "../weather";

describe("Weather Types", () => {
  it("should validate WeatherData structure", () => {
    const weatherData: WeatherData = {
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

    expect(weatherData).toBeDefined();
    expect(typeof weatherData.city).toBe("string");
    expect(typeof weatherData.temperature).toBe("number");
  });

  it("should validate WeatherApiResponse structure", () => {
    const apiResponse: WeatherApiResponse = {
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

    expect(apiResponse).toBeDefined();
    expect(apiResponse.weather).toHaveLength(1);
  });
});
