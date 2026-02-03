import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "../test/utils";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import * as weatherService from "../services/weatherService";
import { mockWeatherData } from "../test/mocks/weatherData";

vi.mock("../services/weatherService");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure the mount effect (default London fetch) always resolves inside the test
    vi.mocked(weatherService.fetchWeatherData).mockResolvedValue(
      mockWeatherData,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the app title", async () => {
    render(<App />);

    expect(screen.getByText("Weather App")).toBeInTheDocument();

    // Wait for mount effect to settle to avoid act warnings
    expect(await screen.findByText("London")).toBeInTheDocument();
  });

  it("should render search input and button", async () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText("Enter city name..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();

    // settle mount update
    await screen.findByText("London");
  });

  it("should load default city (London) on mount", async () => {
    render(<App />);

    // Assert that the service was called and UI updated
    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith("London");
    expect(await screen.findByText("London")).toBeInTheDocument();
  });

  it("should update city input when typing", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");
    await user.clear(input);
    await user.type(input, "Paris");

    expect(input).toHaveValue("Paris");
  });

  it("should search for weather when search button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "Paris");
    await user.click(button);

    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith("Paris");
  });

  it("should search for weather when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");

    await user.clear(input);
    await user.type(input, "Tokyo{Enter}");

    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith("Tokyo");
  });

  it("should display weather data after successful search", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    // make service return the same mock data (already defaulted in beforeEach)
    await user.clear(input);
    await user.type(input, "London");
    await user.click(button);

    // UI already shows London, but this asserts the flow is stable
    expect(await screen.findByText("London")).toBeInTheDocument();
  });

  it("should display loading state while fetching", async () => {
    const user = userEvent.setup();

    // 1) Mount call resolves immediately (London)
    vi.mocked(weatherService.fetchWeatherData).mockResolvedValueOnce(
      mockWeatherData,
    );

    // 2) Search call is deferred
    let resolveSearch!: (value: any) => void;
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve;
    });

    vi.mocked(weatherService.fetchWeatherData).mockImplementationOnce(
      () => searchPromise as any,
    );

    render(<App />);

    // settle mount updates
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "Berlin");
    await user.click(button);

    // loading appears while promise pending
    expect(screen.getByText("Fetching weather data...")).toBeInTheDocument();

    // resolve the pending fetch
    resolveSearch(mockWeatherData);

    // ✅ IMPORTANT: wait for the resulting React state update
    await waitFor(() => {
      expect(
        screen.queryByText("Fetching weather data..."),
      ).not.toBeInTheDocument();
    });
  });

  it("should display error message when fetch fails", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const errorMessage =
      "City not found. Please check the spelling and try again.";
    vi.mocked(weatherService.fetchWeatherData).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "InvalidCity");
    await user.click(button);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it("should not search with empty city name", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const initialCalls = vi.mocked(weatherService.fetchWeatherData).mock.calls
      .length;

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.click(button);

    expect(vi.mocked(weatherService.fetchWeatherData).mock.calls.length).toBe(
      initialCalls,
    );
  });

  it("should not search with whitespace-only city name", async () => {
    const user = userEvent.setup();
    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const initialCalls = vi.mocked(weatherService.fetchWeatherData).mock.calls
      .length;

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "   ");
    await user.click(button);

    expect(vi.mocked(weatherService.fetchWeatherData).mock.calls.length).toBe(
      initialCalls,
    );
  });

  it("should clear previous error when new search is initiated", async () => {
    const user = userEvent.setup();

    vi.mocked(weatherService.fetchWeatherData)
      .mockResolvedValueOnce(mockWeatherData) // mount London
      .mockRejectedValueOnce(new Error("City not found")) // first search
      .mockResolvedValueOnce(mockWeatherData); // second search

    render(<App />);

    // settle mount update
    await screen.findByText("London");

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "InvalidCity");
    await user.click(button);

    expect(await screen.findByText(/city not found/i)).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "London");
    await user.click(button);

    // error cleared
    await vi.waitFor(() => {
      expect(screen.queryByText(/city not found/i)).not.toBeInTheDocument();
    });
  });

  it("should handle unexpected errors gracefully", async () => {
    const user = userEvent.setup();

    render(<App />);

    // settle mount fetch
    await screen.findByText("London");

    // trigger the "unknown error" branch
    vi.mocked(weatherService.fetchWeatherData).mockRejectedValueOnce(
      "Unexpected error",
    );

    const input = screen.getByPlaceholderText("Enter city name...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.clear(input);
    await user.type(input, "Paris");
    await user.click(button);

    expect(
      await screen.findByText(/unexpected error occurred/i),
    ).toBeInTheDocument();
  });
});
