/**
 * Color configuration for Transit IA application
 * Provides consistent color palette for light and dark themes
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Main brand color
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  // Secondary colors
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Success colors
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Error colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Info colors
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
} as const;

// Theme-specific color mappings
export const lightTheme = {
  background: colors.secondary[50],
  foreground: colors.secondary[900],
  card: "#ffffff",
  cardForeground: colors.secondary[900],
  primary: colors.primary[500],
  primaryForeground: "#ffffff",
  secondary: colors.secondary[100],
  secondaryForeground: colors.secondary[900],
  muted: colors.secondary[100],
  mutedForeground: colors.secondary[500],
  accent: colors.secondary[100],
  accentForeground: colors.secondary[900],
  border: colors.secondary[200],
  input: colors.secondary[200],
  ring: colors.primary[500],
} as const;

export const darkTheme = {
  background: colors.secondary[900],
  foreground: colors.secondary[50],
  card: colors.secondary[800],
  cardForeground: colors.secondary[50],
  primary: colors.primary[400],
  primaryForeground: colors.secondary[900],
  secondary: colors.secondary[800],
  secondaryForeground: colors.secondary[50],
  muted: colors.secondary[800],
  mutedForeground: colors.secondary[400],
  accent: colors.secondary[800],
  accentForeground: colors.secondary[50],
  border: colors.secondary[700],
  input: colors.secondary[700],
  ring: colors.primary[400],
} as const;

// Utility functions for color manipulation
export const getColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
};

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in a real app you might want a more sophisticated approach
  const isLight =
    backgroundColor.includes("50") ||
    backgroundColor.includes("100") ||
    backgroundColor.includes("200");
  return isLight ? colors.secondary[900] : colors.secondary[50];
};
