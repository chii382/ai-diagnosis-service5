"use client";

import { createTheme } from "@mui/material/styles";

export const ACCENT = "#387bff";

export const ACCENT_GLOW =
  "radial-gradient(1000px 600px at 50% 0%, rgba(56,123,255,0.28), transparent 65%)";

export const PANEL_TINTS = {
  blue: "radial-gradient(1200px 800px at 80% 30%, rgba(37,99,235,0.35), transparent 60%)",
  indigo:
    "radial-gradient(1200px 800px at 20% 30%, rgba(99,49,221,0.35), transparent 60%)",
  teal: "radial-gradient(1200px 800px at 70% 70%, rgba(13,148,136,0.32), transparent 60%)",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: ACCENT,
      contrastText: "#ffffff",
    },
    background: {
      default: "#000000",
      paper: "#0a0a0a",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.7)",
    },
    divider: "rgba(255,255,255,0.14)",
  },
  typography: {
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" },
    h2: { fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.01em" },
    h3: { fontWeight: 600, lineHeight: 1.2 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
  },
});

export default theme;
