import Box from "@mui/material/Box";
import { palette } from "../theme";

export default function ConnectionChip({ connected }: { connected: boolean }) {
  const color = connected ? palette.success : palette.gold;
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 99,
        border: `1px solid ${palette.line}`,
        backgroundColor: "rgba(30,17,69,0.7)",
        fontSize: 13,
        fontWeight: 600,
        color: palette.mist,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 0 3px ${color}33`,
        }}
      />
      {connected ? "Terhubung" : "Menghubungkan…"}
    </Box>
  );
}
