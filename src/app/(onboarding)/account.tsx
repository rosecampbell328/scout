import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Button } from "@/components/Button";
import { OnboardingFrame } from "@/components/OnboardingFrame";
import { useProfile } from "@/data/profile";
import { useSession } from "@/data/session";
import { colors, fonts, labelText, spacing } from "@/theme";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function AccountScreen() {
  const params = useLocalSearchParams<{ mode?: "signup" | "login" }>();
  const [mode, setMode] = useState<"signup" | "login">(params.mode ?? "signup");
  const { signIn } = useSession();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const signingUp = mode === "signup";
  const errors = {
    name: signingUp && !name.trim() ? "Enter your name" : null,
    email: !isEmail(email) ? "Enter a valid email" : null,
    password:
      password.length < 8 ? "Password must be at least 8 characters" : null,
  };
  const valid = !errors.name && !errors.email && !errors.password;

  const submit = () => {
    setSubmitted(true);
    if (!valid) return;
    // TODO: create the account / log in with a real auth provider.
    signIn({ name: name.trim(), email: email.trim().toLowerCase() });
    if (signingUp && !profile.realName)
      updateProfile({ realName: name.trim() });
    router.push("/paywall");
  };

  return (
    <OnboardingFrame
      step={2}
      title={signingUp ? "Create your account" : "Welcome back"}
      subtitle={
        signingUp
          ? "Save locations, share your own and build your profile."
          : "Log in to pick up where you left off."
      }
      footer={
        <>
          <Button title={signingUp ? "Sign up" : "Log in"} onPress={submit} />
          <Pressable
            onPress={() => {
              setMode(signingUp ? "login" : "signup");
              setSubmitted(false);
            }}
            hitSlop={8}
            style={styles.switch}
          >
            <Text style={styles.switchText}>
              {signingUp ? "Already have an account? " : "New to Scout? "}
              <Text style={styles.switchLink}>
                {signingUp ? "Log in" : "Sign up"}
              </Text>
            </Text>
          </Pressable>
        </>
      }
    >
      {signingUp && (
        <Field label="Full name" error={submitted ? errors.name : null}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="First and last name"
            placeholderTextColor={colors.accentSoft}
            style={styles.input}
            textContentType="name"
            autoComplete="name"
            returnKeyType="next"
          />
        </Field>
      )}
      <Field label="Email" error={submitted ? errors.email : null}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.accentSoft}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
        />
      </Field>
      <Field label="Password" error={submitted ? errors.password : null}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={signingUp ? "At least 8 characters" : "Your password"}
          placeholderTextColor={colors.accentSoft}
          style={styles.input}
          secureTextEntry
          textContentType={signingUp ? "newPassword" : "password"}
          autoComplete={signingUp ? "new-password" : "current-password"}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </Field>
    </OnboardingFrame>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={[labelText, styles.label]}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  label: { fontSize: 10, color: colors.textMuted },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
  },
  error: { fontFamily: fonts.body, fontSize: 12, color: colors.pin },
  switch: { alignSelf: "center", padding: spacing.xs },
  switchText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  switchLink: { color: colors.text, textDecorationLine: "underline" },
});
