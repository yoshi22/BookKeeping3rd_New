import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type AppIconName = "book" | "repeat" | "refresh" | "chart" | "remove";

const iconMap: Record<AppIconName, keyof typeof MaterialCommunityIcons.glyphMap> =
  {
    book: "book-open-variant",
    repeat: "refresh",
    refresh: "refresh",
    chart: "chart-line",
    remove: "delete",
  };

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  weight?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 28,
  color,
}) => {
  const { theme } = useTheme();
  const iconColor = color ?? theme.colors.text;

  return (
    <MaterialCommunityIcons
      name={iconMap[name]}
      size={size}
      color={iconColor}
    />
  );
};
