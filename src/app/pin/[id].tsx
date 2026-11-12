import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/Button";
import { PinPhoto } from "@/components/PinPhoto";
import { usePins } from "@/data/pins";
import { colors, fonts, labelText, spacing } from "@/theme";

export default function PinDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPin, isFavorite, toggleFavorite } = usePins();
  const pin = getPin(id);

  if (!pin) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>Location not found</Text>
      </View>
    );
  }

  const favorite = isFavorite(pin.id);

  const openDirections = () => {
    const { latitude: lat, longitude: lng } = pin;
    const url =
      Platform.OS === "ios"
        ? `https://maps.apple.com/?daddr=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable
              onPress={() => toggleFavorite(pin.id)}
              hitSlop={10}
              accessibilityLabel={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={26}
                color={favorite ? colors.pin : colors.text}
              />
            </Pressable>
          ),
        }}
      />
      <PinPhoto uri={pin.photoUri} />

      <View style={styles.body}>
        <Text style={[labelText, styles.meta]}>
          {pin.latitude.toFixed(4)}°, {pin.longitude.toFixed(4)}°
        </Text>
        <Text style={styles.title}>{pin.title}</Text>
        <Text style={styles.byline}>scouted by {pin.author}</Text>

        {pin.description ? (
          <Text style={styles.description}>{pin.description}</Text>
        ) : null}

        {pin.tags.length > 0 && (
          <View style={styles.tags}>
            {pin.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={[labelText, { fontSize: 10 }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => toggleFavorite(pin.id)}
          style={({ pressed }) => [
            styles.favButton,
            favorite && styles.favButtonOn,
            pressed && { opacity: 0.75 },
          ]}
          accessibilityRole="button"
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={18}
            color={favorite ? colors.buttonText : colors.text}
          />
          <Text style={[labelText, favorite && { color: colors.buttonText }]}>
            {favorite ? "Saved to favorites" : "Add to favorites"}
          </Text>
        </Pressable>
        <Button
          title="Get directions"
          variant="outline"
          onPress={openDirections}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  body: { padding: spacing.lg, gap: spacing.sm },
  meta: { color: colors.textMuted, fontSize: 10 },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
  },
  byline: {
    fontFamily: fonts.displayItalic,
    fontSize: 17,
    color: colors.textMuted,
  },
  description: {
    fontFamily: fonts.bodyLight,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSubtle,
    marginTop: spacing.md,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  favButton: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
  },
  favButtonOn: { backgroundColor: colors.button, borderColor: colors.button },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentSoft,
    backgroundColor: colors.surfaceCool,
  },
});
