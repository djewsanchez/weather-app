import { describe, it, expect } from "vitest";
import { render } from "../../test/utils";
import { WeatherIcon } from "../WeatherIcon";

describe("WeatherIcon", () => {
  it("should render sun icon for clear weather", () => {
    const { container } = render(<WeatherIcon condition="Clear" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render cloud icon for cloudy weather", () => {
    const { container } = render(<WeatherIcon condition="Clouds" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render rain icon for rainy weather", () => {
    const { container } = render(<WeatherIcon condition="Rain" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render rain icon for drizzle", () => {
    const { container } = render(<WeatherIcon condition="Drizzle" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render snow icon for snowy weather", () => {
    const { container } = render(<WeatherIcon condition="Snow" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render storm icon for thunderstorm", () => {
    const { container } = render(<WeatherIcon condition="Thunderstorm" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render default cloud icon for unknown condition", () => {
    const { container } = render(<WeatherIcon condition="Unknown" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should handle case-insensitive conditions", () => {
    const { container } = render(<WeatherIcon condition="CLEAR" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should use custom size when provided", () => {
    const { container } = render(<WeatherIcon condition="Clear" size={50} />);
    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("width", "50");
    expect(icon).toHaveAttribute("height", "50");
  });

  it("should use default size of 80 when not provided", () => {
    const { container } = render(<WeatherIcon condition="Clear" />);
    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("width", "80");
    expect(icon).toHaveAttribute("height", "80");
  });
});
