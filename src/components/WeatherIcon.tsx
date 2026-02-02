import React from "react";
import {
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconSun,
  IconCloudStorm,
} from "@tabler/icons-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 80,
}) => {
  const iconProps = { size, strokeWidth: 1.5 };

  switch (condition.toLowerCase()) {
    case "clear":
      return <IconSun {...iconProps} color="#FFA500" />;
    case "clouds":
      return <IconCloud {...iconProps} color="#9CA3AF" />;
    case "rain":
    case "drizzle":
      return <IconCloudRain {...iconProps} color="#60A5FA" />;
    case "snow":
      return <IconCloudSnow {...iconProps} color="#BFDBFE" />;
    case "thunderstorm":
      return <IconCloudStorm {...iconProps} color="#7C3AED" />;
    default:
      return <IconCloud {...iconProps} color="#9CA3AF" />;
  }
};
