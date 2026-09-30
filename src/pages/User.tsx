import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Shell from "../components/Shell";
import ConnectionChip from "../components/ConnectionChip";
import BuzzButton from "../components/BuzzButton";
import { useBuzzSocket } from "../hooks/useBuzzSocket";
import { socket } from "../socket";
import { fontDisplay, palette } from "../theme";
import type { BuzzResult } from "../types";

const NAME_KEY = "buzz:name";
const MAX_NAME = 24;

function loadName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function User() {
  const { connected, state, me } = useBuzzSocket("player");

  const [name, setName] = useState(loadName);
  const [draft, setDraft] = useState(name);
  const [message, setMessage] = useState<string | null>(null);
  const sending = useRef(false);

  const buzzed = me.rank !== null;
  const canBuzz = connected && !state.locked && !buzzed;

  // Pesan error hilang otomatis ketika keadaan berubah (mis. host mereset ronde).
  useEffect(() => {
    setMessage(null);
  }, [state.round, state.locked]);

  const saveName = () => {
    const clean = draft.replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
    if (!clean) return;
    try {
      localStorage.setItem(NAME_KEY, clean);
    } catch {
      /* mode privat — nama tetap dipakai selama halaman terbuka */
    }
    setName(clean);
    setDraft(clean);
  };

  const buzz = useCallback(() => {
    if (!canBuzz || sending.current || !name) return;
    sending.current = true;
    navigator.vibrate?.(40);

    const release = window.setTimeout(() => {
      sending.current = false;
    }, 2000);

    socket.emit("buzz", name, (res: BuzzResult) => {
      window.clearTimeout(release);
      sending.current = false;
      if (res.ok) return;
      if (res.reason === "locked") setMessage("Ronde sudah ditutup oleh host.");
      else if (res.reason === "invalid_name") setMessage("Nama tidak valid. Coba ganti nama.");
    });
  }, [canBuzz, name]);

  /* ---------------- Langkah 1: isi nama ---------------- */
  if (!name) {
    return (
      <Shell maxWidth={520} actions={<ConnectionChip connected={connected} />}>
        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 30 } }}>
            Siapa namamu?
          </Typography>
          <Typography sx={{ color: palette.muted, mt: 1, mb: 3 }}>
            Nama ini akan tampil di layar host saat kamu menekan buzzer.
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              saveName();
            }}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              autoFocus
              fullWidth
              label="Nama kamu"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              slotProps={{ htmlInput: { maxLength: MAX_NAME, autoComplete: "nickname", enterKeyHint: "go" } }}
            />
            <Button type="submit" variant="contained" size="large" disabled={!draft.trim()}>
              Mulai bermain
            </Button>
          </Box>
        </Paper>
      </Shell>
    );
  }

  /* ---------------- Langkah 2: buzzer ---------------- */
  const myEntry = state.entries.find((e) => e.rank === me.rank);
  const leader = state.entries[0];

  let variant: "ready" | "locked" | "offline" | "buzzed" = "ready";
  if (buzzed) variant = "buzzed";
  else if (!connected) variant = "offline";
  else if (state.locked) variant = "locked";

  let headline = "Siap? Tekan saat kamu tahu jawabannya";
  let sub = "";
  if (!connected) {
    headline = "Menghubungkan ke server…";
    sub = "Buzzer aktif kembali setelah tersambung.";
  } else if (buzzed && me.rank === 1) {
    headline = "Kamu tercepat!";
    sub = "Tunggu host melanjutkan ke ronde berikutnya.";
  } else if (buzzed) {
    headline = `Kamu urutan ke-${me.rank}`;
    sub = myEntry ? `${myEntry.delta} ms setelah ${leader?.name ?? "yang tercepat"}` : "";
  } else if (state.locked) {
    headline = "Ronde ditutup";
    sub = "Tunggu host membuka buzzer.";
  }

  return (
    <Shell maxWidth={560} actions={<ConnectionChip connected={connected} />}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Typography sx={{ color: palette.muted }}>Bermain sebagai</Typography>
          <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
          <Button
            size="small"
            color="secondary"
            disabled={buzzed}
            onClick={() => {
              setName("");
              setDraft(name);
              try {
                localStorage.removeItem(NAME_KEY);
              } catch {
                /* abaikan */
              }
            }}
            sx={{ minWidth: 0, py: 0.25, px: 1 }}
          >
            Ganti nama
          </Button>
        </Box>

        <BuzzButton variant={variant} onPress={buzz} />

        <Box aria-live="polite" sx={{ minHeight: 84 }}>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: { xs: 22, sm: 26 },
              color: buzzed && me.rank === 1 ? palette.gold : palette.mist,
            }}
          >
            {headline}
          </Typography>
          {sub && <Typography sx={{ color: palette.muted, mt: 0.75 }}>{sub}</Typography>}
          {message && (
            <Typography sx={{ color: palette.danger, mt: 0.75, fontWeight: 600 }}>{message}</Typography>
          )}
          {!buzzed && leader && connected && (
            <Typography sx={{ color: palette.lavender, mt: 0.75, fontWeight: 600 }}>
              {leader.name} sudah menekan lebih dulu
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 3, color: palette.muted, fontSize: 14 }}>
          <span>Ronde {state.round}</span>
          <span>{state.players} pemain online</span>
        </Box>
      </Box>
    </Shell>
  );
}
