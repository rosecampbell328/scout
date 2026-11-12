import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "@/components/Button";
import { PinPhoto } from "@/components/PinPhoto";
import { usePins } from "@/data/pins";
import { useProfile } from "@/data/profile";
import { colors, fonts, labelText, spacing } from "@/theme";

type Coord = { latitude: number; longitude: number };

export default function AddPin() {
  const params = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const { addPin } = usePins();
  const { displayName } = useProfile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [coord, setCoord] = useState<Coord | null>(
    params.lat && params.lng
      ? { latitude: Number(params.lat), longitude: Number(params.lng) }
      : null,
  );
  const [locating, setLocating] = useState(coord === null);

  const locateMe = () => {
    setLocating(true);
    getMyCoord()
      .then((c) => c && setCoord(c))
      .finally(() => setLocating(false));
  };

  // No coordinate passed in from the map → default to the photographer's current spot.
  useEffect(() => {
    if (coord) return;
    let active = true;
    getMyCoord()
      .then((c) => active && c && setCoord(c))
      .finally(() => active && setLocating(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const canSave = title.trim().length > 0 && coord !== null;

  const save = () => {
    if (!coord) return;
    const pin = addPin({
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      author: displayName,
      photoUri,
      ...coord,
    });
    router.dismissTo(`/pin/${pin.id}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={pickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Add a photo"
        >
          {photoUri ? (
            <PinPhoto uri={photoUri} />
          ) : (
            <View style={styles.photoEmpty}>
              <Text style={styles.photoPlus}>+</Text>
              <Text style={labelText}>Add a photo</Text>
              <Text style={styles.photoHint}>show others how it looks</Text>
            </View>
          )}
        </Pressable>
        {photoUri && (
          <Pressable onPress={pickPhoto} style={styles.changePhoto}>
            <Text
              style={[labelText, { fontSize: 10, color: colors.textMuted }]}
            >
              Change photo
            </Text>
          </Pressable>
        )}

        <Field label="Location name">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Wildflower meadow"
            placeholderTextColor={colors.accentSoft}
            style={styles.input}
          />
        </Field>

        <Field label="Notes">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Best time of day, parking, permits…"
            placeholderTextColor={colors.accentSoft}
            style={[styles.input, styles.multiline]}
            multiline
          />
        </Field>

        <Field label="Tags">
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="golden hour, florals, urban"
            placeholderTextColor={colors.accentSoft}
            style={styles.input}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Coordinates">
          <View style={styles.coordRow}>
            {locating ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <Text style={styles.coordText}>
                {coord
                  ? `${coord.latitude.toFixed(4)}°, ${coord.longitude.toFixed(4)}°`
                  : "Not set"}
              </Text>
            )}
            <Pressable onPress={locateMe} hitSlop={8}>
              <Text style={[labelText, { fontSize: 10, color: colors.accent }]}>
                Use my location
              </Text>
            </Pressable>
          </View>
        </Field>

        <Text style={styles.postingAs}>posting as {displayName}</Text>

        <Button
          title="Pin this location"
          onPress={save}
          disabled={!canSave}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

async function getMyCoord(): Promise<Coord | null> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Location off",
        "Allow location access, or long-press the map to drop a pin instead.",
      );
      return null;
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    Alert.alert(
      "Couldn't find you",
      "Try again, or long-press the map to drop a pin.",
    );
    return null;
  }
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={[labelText, styles.fieldLabel]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  photoEmpty: {
    aspectRatio: 4 / 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: "dashed",
    borderColor: colors.textSubtle,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  photoPlus: {
    fontFamily: fonts.display,
    fontSize: 48,
    color: colors.textMuted,
    lineHeight: 52,
  },
  photoHint: {
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    color: colors.textMuted,
  },
  changePhoto: { alignSelf: "center", padding: spacing.sm },
  field: { marginTop: spacing.lg },
  fieldLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
  },
  multiline: { minHeight: 72, textAlignVertical: "top" },
  coordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
    minHeight: 40,
  },
  postingAs: {
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  coordText: { fontFamily: fonts.body, fontSize: 16, color: colors.text },
});
