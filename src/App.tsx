import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Text,
  Group,
  Stack,
  Loader,
  Alert,
  Box,
} from "@mantine/core";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import type { WeatherData } from "./types/weather";
import { fetchWeatherData } from "./services/weatherService";
import { WeatherCard } from "./components/WeatherCard";

export const App: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchCity?: string) => {
    const cityToSearch = searchCity || city;
    if (!cityToSearch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(cityToSearch);
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch("London");
  }, []);

  return (
    <Container size="sm" py={60}>
      <Stack gap="xl">
        <div style={{ textAlign: "center" }}>
          <Title
            order={1}
            size={48}
            mb="xs"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Weather App
          </Title>
          <Text c="dimmed" size="lg">
            Search for weather conditions in any city worldwide
          </Text>
        </div>

        <Group gap="xs">
          <TextInput
            placeholder="Enter city name..."
            size="lg"
            flex={1}
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            leftSection={<IconSearch size={20} />}
            styles={{
              input: {
                transition: "border-color 0.2s ease",
                "&:focus": {
                  borderColor: "#667eea",
                },
              },
            }}
          />
          <Button
            size="lg"
            onClick={() => handleSearch()}
            loading={loading}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Search
          </Button>
        </Group>

        {loading && (
          <Box style={{ textAlign: "center", padding: "60px 0" }}>
            <Loader size="lg" />
            <Text mt="md" c="dimmed">
              Fetching weather data...
            </Text>
          </Box>
        )}

        {error && (
          <Alert
            icon={<IconAlertCircle size={20} />}
            title="Error"
            color="red"
            variant="light"
            styles={{
              root: {
                transition: "opacity 0.3s ease",
              },
            }}
          >
            {error}
          </Alert>
        )}

        {weather && !loading && (
          <Box
            style={{
              animation: "fadeIn 0.5s ease-in",
            }}
          >
            <WeatherCard weather={weather} />
          </Box>
        )}
      </Stack>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Container>
  );
};
