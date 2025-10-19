import React from "react";
import {
  BookOpen,
  Repeat,
  ChartLineUp,
  Trash,
  IconProps,
} from "phosphor-react-native";
import { useTheme } from "@/context/ThemeContext";

type AppIconName = "book" | "repeat" | "chart" | "remove";

const iconMap: Record<AppIconName, React.ComponentType<IconProps>> = {
  book: BookOpen,
  repeat: Repeat,
  chart: ChartLineUp,
  remove: Trash,
};

interface AppIconProps extends Partial<IconProps> {
  name: AppIconName;
  size?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 28,
  color,
  weight = "duotone",
}) => {
  const { theme } = useTheme();
  const IconComponent = iconMap[name];
  const iconColor = color ?? theme.colors.text;

  return <IconComponent size={size} color={iconColor} weight={weight} />;
};

