import React, { memo } from "react";
import { View, StyleSheet, Image } from "react-native";

export type QuickActionIconType = "learning" | "review" | "statistics";

interface QuickActionIconProps {
  type: QuickActionIconType;
  size?: number;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  withBackground?: boolean;
}

const ICON_IMAGES: Record<QuickActionIconType, any> = {
  learning: require("../../../assets/learning-icon.png"),
  review: require("../../../assets/review-icon.png"),
  statistics: require("../../../assets/statistics-icon.png"),
};

const QuickActionIcon: React.FC<QuickActionIconProps> = memo(
  ({
    type,
    size = 48,
    primaryColor,
    secondaryColor,
    backgroundColor,
    withBackground = true,
  }) => {
    const containerStyle = {
      width: size,
      height: size,
      borderRadius: size * 0.32,
      backgroundColor: withBackground
        ? (backgroundColor ?? `${primaryColor}1F`)
        : "transparent",
    } as const;

    return (
      <View style={[styles.base, containerStyle]}>
        <Image
          source={ICON_IMAGES[type]}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
    );
  },
);

QuickActionIcon.displayName = "QuickActionIcon";

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default QuickActionIcon;
