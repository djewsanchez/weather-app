import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchWeatherData } from "../weatherService";
import { mockApiResponse } from "../../test/mocks/weatherData";

describe("weatherService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should fetch and transform weather data successfully", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), { status: 200 }),
    );

    const result = await fetchWeatherData("London");

    expect(result).toEqual({
      city: "London",
      country: "GB",
      temperature: 15,
      feelsLike: 13,
      condition: "Clouds",
      description: "scattered clouds",
      humidity: 72,
      windSpeed: 18,
      icon: "03d",
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("London"),
    );
  });

  it("should throw error when city is not found (404)", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(null, { status: 404 }),
    );

    await expect(fetchWeatherData("NonExistentCity")).rejects.toThrow(
      "City not found. Please check the spelling and try again.",
    );
  });

  it("should throw error when API key is invalid (401)", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(null, { status: 401 }),
    );

    await expect(fetchWeatherData("London")).rejects.toThrow(
      "Invalid API key. Please check your configuration.",
    );
  });

  it("should throw generic error for other failures", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(null, { status: 500 }),
    );

    await expect(fetchWeatherData("London")).rejects.toThrow(
      "Failed to fetch weather data. Please try again later.",
    );
  });

  it("should properly encode city names with spaces", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), { status: 200 }),
    );

    await fetchWeatherData("New York");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("New%20York"),
    );
  });

  it("should convert wind speed from m/s to km/h", async () => {
    const responseWithWind = { ...mockApiResponse, wind: { speed: 10 } };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseWithWind), { status: 200 }),
    );

    const result = await fetchWeatherData("London");

    expect(result.windSpeed).toBe(36);
  });
});
