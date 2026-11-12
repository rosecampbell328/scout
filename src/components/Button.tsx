import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from "react-native";

import { colors, labelText } from "@/theme";

type Props = Omit<PressableProps, "style"> & {
  title: string;
  variant?: "solid" | "outline";
  style?: ViewStyle;
};

/** Square-edged, uppercase, letter-spaced button. */
export function Button({
  title,
  variant = "solid",
  style,
  disabled,
  ...rest
}: Props) {
  const solid = variant === "solid";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        solid ? styles.solid : styles.outline,
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.75 },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[labelText, { color: solid ? colors.buttonText : colors.text }]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  solid: { backgroundColor: colors.button },
  outline: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
    backgroundColor: "transparent",
  },
});
