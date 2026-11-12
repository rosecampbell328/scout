import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
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
import { useProfile } from "@/data/profile";
import { colors, fonts, labelText, spacing } from "@/theme";

export default function EditProfile() {
  const { profile, updateProfile } = useProfile();
  const [photoUri, setPhotoUri] = useState(profile.photoUri);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [realName, setRealName] = useState(profile.realName);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const save = () => {
    updateProfile({
      photoUri,
      businessName: businessName.trim(),
      realName: realName.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={pickPhoto}
          style={styles.photoWrap}
          accessibilityLabel="Choose profile photo"
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Ionicons
                name="camera-outline"
                size={32}
                color={colors.textMuted}
              />
            </View>
          )}
          <Text style={[labelText, styles.photoLabel]}>
            {photoUri ? "Change photo" : "Add photo"}
          </Text>
        </Pressable>

        <View style={styles.field}>
          <Text style={[labelText, styles.fieldLabel]}>Business name</Text>
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="e.g. Golden Hour Studio"
            placeholderTextColor={colors.accentSoft}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={[labelText, styles.fieldLabel]}>Your name</Text>
          <TextInput
            value={realName}
            onChangeText={setRealName}
            placeholder="First and last name"
            placeholderTextColor={colors.accentSoft}
            style={styles.input}
            textContentType="name"
          />
        </View>

        <Button title="Save" onPress={save} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  photoWrap: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarEmpty: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  photoLabel: { fontSize: 10, color: colors.accent },
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
});
