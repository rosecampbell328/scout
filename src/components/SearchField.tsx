import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { colors, fonts } from "@/theme";

type Props = Omit<TextInputProps, "style" | "onChange"> & {
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
};

export function SearchField({ value, onChangeText, style, ...rest }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Ionicons name="search" size={16} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.accentSoft}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        {...rest}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={16} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
    height: "100%",
  },
});
