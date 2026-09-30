import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { fontDisplay, palette } from "../theme";

type Props = {
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: number;
};

/** Kerangka halaman: header merek di atas, konten di bawah. */
export default function Shell({ children, actions, maxWidth = 1120 }: Props) {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          px: { xs: 2, sm: 4 },
          py: 2,
          borderBottom: `1px solid ${palette.line}`,
          backgroundColor: "rgba(20,10,43,0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1.25, textDecoration: "none", color: "inherit" }}
        >
          <Box component="img" src="/nexus.png" alt="" sx={{ width: 36, height: 36, objectFit: "contain" }} />
          <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
            Nexus.Art Buzz
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>{actions}</Box>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth,
          mx: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 3, md: 5 },
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
