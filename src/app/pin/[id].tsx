import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Alert,
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
import { ME } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

export default function PinDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPin, isFavorite, toggleFavorite, deletePin } = usePins();
  const pin = getPin(id);

  if (!pin) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>Location not found</Text>
      </View>
    );
  }

  const favorite = isFavorite(pin.id);
  const isMine = pin.ownerId === ME;

  const confirmDelete = () => {
    const remove = () => {
      if (router.canGoBack()) router.back();
      else router.replace("/");
      deletePin(pin.id);
    };
    const message = "This removes the pin and its photo from Scout.";
    if (Platform.OS === "web") {
      // Alert buttons aren't supported in the browser.
      if (window.confirm(`Delete “${pin.title}”? ${message}`)) remove();
      return;
    }
    Alert.alert(`Delete “${pin.title}”?`, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);
  };

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
      <Stack.Screen options={{ title: "" }} />
      <PinPhoto uri={pin.photoUri} />

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.address} numberOfLines={2}>
            {pin.address}
          </Text>
          <Pressable
            onPress={() => toggleFavorite(pin.id)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={
              favorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={28}
              color={favorite ? colors.pin : colors.text}
            />
          </Pressable>
        </View>
        <Text style={styles.title}>{pin.title}</Text>
        <Text style={styles.byline}>
          scouted by{" "}
          <Text
            style={styles.authorLink}
            onPress={() => router.push(`/user/${pin.ownerId}`)}
            accessibilityRole="link"
          >
            {pin.author}
          </Text>
        </Text>

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

        <Button
          title="Get directions"
          variant="outline"
          onPress={openDirections}
          style={{ marginTop: spacing.lg }}
        />

        {isMine && (
          <View style={styles.ownerActions}>
            <Button
              title="Edit location"
              variant="outline"
              style={styles.ownerButton}
              onPress={() =>
                router.push({ pathname: "/add", params: { id: pin.id } })
              }
            />
            <Pressable
              onPress={confirmDelete}
              style={({ pressed }) => [
                styles.ownerButton,
                styles.deleteButton,
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={15} color={colors.pin} />
              <Text style={[labelText, { color: colors.pin }]}>Delete</Text>
            </Pressable>
          </View>
        )}
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
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ownerActions: { flexDirection: "row", gap: spacing.sm },
  ownerButton: { flex: 1 },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.pin,
  },
  address: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSubtle,
    paddingRight: spacing.md,
  },
  authorLink: {
    fontFamily: fonts.display,
    color: colors.text,
    textDecorationLine: "underline",
  },
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
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentSoft,
    backgroundColor: colors.surfaceCool,
  },
});
