import { createTheme } from "@mui/material/styles";

export const palette = {
  ink: "#140A2B", // latar utama
  plum: "#1E1145", // permukaan kartu
  plumHigh: "#291863", // permukaan terangkat
  line: "rgba(205, 191, 255, 0.14)",
  violet: "#7C5CF0", // warna utama (selaras logo)
  violetDeep: "#5B3FD1",
  lavender: "#CDBFFF",
  mist: "#F3F0FF",
  muted: "#A79BCF",
  gold: "#F5C451", // khusus juara pertama
  success: "#5EE0A0",
  danger: "#FF7A90",
};

export const fontDisplay = '"Sora", "Plus Jakarta Sans", system-ui, sans-serif';
export const fontBody = '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: palette.violet, dark: palette.violetDeep, light: palette.lavender, contrastText: "#fff" },
    secondary: { main: palette.lavender },
    success: { main: palette.success },
    error: { main: palette.danger },
    background: { default: palette.ink, paper: palette.plum },
    text: { primary: palette.mist, secondary: palette.muted },
    divider: palette.line,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: fontBody,
    h1: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontFamily: fontDisplay, fontWeight: 700 },
    h6: { fontFamily: fontDisplay, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100dvh",
          backgroundImage:
            "radial-gradient(900px 500px at 50% -10%, rgba(124, 92, 240, 0.28), transparent 70%)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: `1px solid ${palette.line}` },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 22, paddingBlock: 11 },
        containedPrimary: {
          background: `linear-gradient(180deg, ${palette.violet}, ${palette.violetDeep})`,
          "&:hover": { background: `linear-gradient(180deg, #8B6FF5, ${palette.violet})` },
          "&.Mui-disabled": { background: "rgba(205,191,255,0.12)", color: "rgba(243,240,255,0.35)" },
        },
        outlinedPrimary: {
          borderColor: "rgba(205,191,255,0.35)",
          color: palette.mist,
          "&:hover": { borderColor: palette.lavender, backgroundColor: "rgba(124,92,240,0.14)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "rgba(20,10,43,0.55)",
          "& fieldset": { borderColor: "rgba(205,191,255,0.22)" },
          "&:hover fieldset": { borderColor: "rgba(205,191,255,0.5)" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { backgroundColor: palette.plum, borderRadius: 20 } },
    },
  },
});
