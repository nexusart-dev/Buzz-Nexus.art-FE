import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import Shell from "../components/Shell";
import { fontDisplay, palette } from "../theme";

const choices = [
  {
    to: "/user",
    title: "Saya pemain",
    text: "Masukkan nama dan tekan buzzer secepat mungkin.",
    primary: true,
  },
  {
    to: "/admin",
    title: "Saya host",
    text: "Lihat urutan buzz secara langsung dan atur ronde.",
    primary: false,
  },
];

export default function Home() {
  return (
    <Shell maxWidth={860}>
      <Box sx={{ textAlign: "center", pt: { xs: 2, md: 6 }, pb: 5 }}>
        <Box component="img" src="/nexus.png" alt="" sx={{ width: 112, height: 112, objectFit: "contain", mb: 2 }} />
        <Typography variant="h2" sx={{ fontSize: { xs: 34, sm: 48 }, lineHeight: 1.1 }}>
          Pingo kuis real-time
        </Typography>
        <Typography sx={{ color: palette.muted, mt: 2, maxWidth: 460, mx: "auto", fontSize: { xs: 16, sm: 18 } }}>
          Siapa yang paling cepat langsung terlihat di layar host, lengkap dengan selisih waktunya.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {choices.map((c) => (
          <Box
            key={c.to}
            component={RouterLink}
            to={c.to}
            sx={{
              display: "block",
              p: 3.5,
              borderRadius: 4,
              textDecoration: "none",
              color: "inherit",
              border: `1px solid ${c.primary ? "rgba(156,130,255,0.6)" : palette.line}`,
              background: c.primary
                ? `linear-gradient(160deg, ${palette.plumHigh}, ${palette.plum})`
                : palette.plum,
              transition: "border-color .2s, transform .2s",
              "&:hover": { borderColor: palette.lavender, transform: "translateY(-2px)" },
              "&:focus-visible": { outline: `3px solid ${palette.lavender}`, outlineOffset: 3 },
              "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
            }}
          >
            <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>{c.title}</Typography>
            <Typography sx={{ color: palette.muted, mt: 1 }}>{c.text}</Typography>
          </Box>
        ))}
      </Box>
    </Shell>
  );
}
