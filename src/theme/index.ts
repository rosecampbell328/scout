/**
 * Scout design tokens.
 * Soft, neutral, editorial palette: warm off-whites, cool greys,
 * slate blues and earthy browns.
 */
export const palette = {
  ink: "#191A1B",
  charcoal: "#212427",
  graphite: "#2A2D31",
  slate: "#424A53",
  mist: "#D0D9E1",
  ice: "#F5F9FC",
  ivory: "#FAFAF6",
  linen: "#F4F4F0", // app background
  fog: "#DCE1E1",
  stone: "#D7D7D2",
  dusk: "#97A6BB",
  espresso: "#483A2A",
  taupe: "#675E52",
  /** Brand accent: headings, text, buttons, active icons. */
  brown: "#453A2C",
} as const;

export const colors = {
  background: palette.linen,
  surface: palette.ivory,
  surfaceCool: palette.ice,
  text: palette.brown,
  textMuted: palette.taupe,
  textSubtle: palette.brown,
  border: palette.stone,
  divider: palette.fog,
  accent: palette.brown,
  accentSoft: palette.dusk,
  button: palette.brown,
  buttonText: palette.ivory,
  placeholder: palette.mist,
  /** Map pins and the favorite heart. */
  pin: "#EC1F27",
  tabActive: palette.brown,
  tabInactive: palette.taupe,
} as const;

export const fonts = {
  // Elegant serif for headings, clean geometric sans for body & labels.
  display: "CormorantGaramond_500Medium",
  displayItalic: "CormorantGaramond_400Regular_Italic",
  body: "Jost_400Regular",
  bodyLight: "Jost_300Light",
  label: "Jost_500Medium",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Uppercase, widely-tracked label style used for nav, buttons and captions. */
export const labelText = {
  fontFamily: fonts.label,
  fontSize: 11,
  letterSpacing: 2.4,
  textTransform: "uppercase" as const,
  color: colors.text,
};
