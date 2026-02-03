import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "../../test/utils";
import { WeatherCard } from "../WeatherCard";
import { mockWeatherData } from "../../test/mocks/weatherData";

describe("WeatherCard", () => {
  it("should render weather data correctly", () => {
    render(<WeatherCard weather={mockWeatherData} />);

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("GB")).toBeInTheDocument();
    expect(screen.getByText("15°C")).toBeInTheDocument();
    expect(screen.getByText("Feels like 13°C")).toBeInTheDocument();
    expect(screen.getByText("scattered clouds")).toBeInTheDocument();
  });

  it("should display humidity information", () => {
    render(<WeatherCard weather={mockWeatherData} />);

    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("should display wind speed information", () => {
    render(<WeatherCard weather={mockWeatherData} />);

    expect(screen.getByText("Wind Speed")).toBeInTheDocument();
    expect(screen.getByText("18 km/h")).toBeInTheDocument();
  });

  it("should render weather icon", () => {
    const { container } = render(<WeatherCard weather={mockWeatherData} />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should capitalize weather description", () => {
    render(<WeatherCard weather={mockWeatherData} />);
    const description = screen.getByText("scattered clouds");
    expect(description).toHaveStyle({ textTransform: "capitalize" });
  });

  it("should render location icon", () => {
    const { container } = render(<WeatherCard weather={mockWeatherData} />);
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(1);
  });

  it("should handle negative temperatures", () => {
    const coldWeather = { ...mockWeatherData, temperature: -5, feelsLike: -8 };
    render(<WeatherCard weather={coldWeather} />);

    expect(screen.getByText("-5°C")).toBeInTheDocument();
    expect(screen.getByText("Feels like -8°C")).toBeInTheDocument();
  });

  it("should handle high wind speeds", () => {
    const windyWeather = { ...mockWeatherData, windSpeed: 85 };
    render(<WeatherCard weather={windyWeather} />);

    expect(screen.getByText("85 km/h")).toBeInTheDocument();
  });

  it("should handle 100% humidity", () => {
    const humidWeather = { ...mockWeatherData, humidity: 100 };
    render(<WeatherCard weather={humidWeather} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("should apply hover styles on mouse enter and revert on mouse leave", () => {
    const { container } = render(<WeatherCard weather={mockWeatherData} />);

    // Mantine Paper root element
    const paper = container.querySelector(".mantine-Paper-root") as HTMLElement;
    expect(paper).toBeTruthy();

    // Hover
    fireEvent.mouseEnter(paper);
    expect(paper.style.transform).toBe("translateY(-4px)");
    expect(paper.style.boxShadow).toBe("0 20px 40px rgba(0,0,0,0.2)");

    // Unhover
    fireEvent.mouseLeave(paper);
    expect(paper.style.transform).toBe("translateY(0)");
    expect(paper.style.boxShadow).toBe("");
  });
});
