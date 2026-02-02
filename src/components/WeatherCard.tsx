import React from "react";
import { Paper, Stack, Group, Title, Badge, Text, Card } from "@mantine/core";
import { IconMapPin, IconDroplet, IconWind } from "@tabler/icons-react";
import type { WeatherData } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="lg"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" mb="xs">
              <IconMapPin size={20} />
              <Title order={2} style={{ color: "white" }}>
                {weather.city}
              </Title>
            </Group>
            <Badge variant="light" color="white" size="sm">
              {weather.country}
            </Badge>
          </div>
          <WeatherIcon condition={weather.condition} />
        </Group>

        <div>
          <Text size="64px" fw={700} style={{ lineHeight: 1, color: "white" }}>
            {weather.temperature}°C
          </Text>
          <Text size="sm" opacity={0.9} mt={4}>
            Feels like {weather.feelsLike}°C
          </Text>
        </div>

        <div>
          <Text tt="capitalize" size="xl" fw={500}>
            {weather.description}
          </Text>
        </div>

        <Group grow mt="md">
          <Card
            p="md"
            radius="md"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Group gap="xs">
              <IconDroplet size={24} />
              <div>
                <Text size="xs" opacity={0.8}>
                  Humidity
                </Text>
                <Text size="lg" fw={600}>
                  {weather.humidity}%
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            p="md"
            radius="md"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Group gap="xs">
              <IconWind size={24} />
              <div>
                <Text size="xs" opacity={0.8}>
                  Wind Speed
                </Text>
                <Text size="lg" fw={600}>
                  {weather.windSpeed} km/h
                </Text>
              </div>
            </Group>
          </Card>
        </Group>
      </Stack>
    </Paper>
  );
};
