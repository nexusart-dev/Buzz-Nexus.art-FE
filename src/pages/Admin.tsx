import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Shell from "../components/Shell";
import ConnectionChip from "../components/ConnectionChip";
import { CheckIcon, CopyIcon, LockIcon, LockOpenIcon, RefreshIcon, VolumeOffIcon, VolumeOnIcon } from "../components/icons";
import { useBuzzSocket } from "../hooks/useBuzzSocket";
import { socket } from "../socket";
import { playBuzz, unlockAudio } from "../sound";
import { fontDisplay, palette } from "../theme";
import type { AdminAuthResult } from "../types";

const PIN_KEY = "buzz:adminPin";

function readPin(): string {
  try {
    return sessionStorage.getItem(PIN_KEY) ?? "";
  } catch {
    return "";
  }
}
function writePin(pin: string | null) {
  try {
    if (pin) sessionStorage.setItem(PIN_KEY, pin);
    else sessionStorage.removeItem(PIN_KEY);
  } catch {
    /* abaikan */
  }
}

export default function Admin() {
  const [auth, setAuth] = useState<"checking" | "ok" | "need_pin">("checking");
  const [pinError, setPinError] = useState(false);
  const [pinDraft, setPinDraft] = useState("");
  const [sound, setSound] = useState(true);
  const [copied, setCopied] = useState(false);

  const authenticate = useCallback((pin: string) => {
    socket.emit("admin:auth", pin, (res: AdminAuthResult) => {
      if (res.ok) {
        setAuth("ok");
        setPinError(false);
        writePin(pin || null);
      } else {
        setAuth("need_pin");
        setPinError(pin.length > 0);
        writePin(null);
      }
    });
  }, []);

  const { connected, state } = useBuzzSocket("admin", () => authenticate(readPin()));

  // Bunyi saat ada pemain baru menekan buzzer (bukan saat halaman baru dibuka / reset).
  const prevCount = useRef<number | null>(null);
  useEffect(() => {
    const count = state.entries.length;
    if (sound && prevCount.current !== null && count > prevCount.current) playBuzz();
    prevCount.current = count;
  }, [state.entries.length, sound]);

  const controlsEnabled = connected && auth === "ok";
  const first = state.entries[0];
  const rest = state.entries.slice(1);
  const playerUrl = `${window.location.origin}/user`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(playerUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia (http biasa) — tautan tetap bisa disalin manual */
    }
  };

  return (
    <Shell
      actions={
        <>
          <Box sx={{ color: palette.muted, fontSize: 14, fontWeight: 600 }}>{state.players} pemain online</Box>
          <Tooltip title={sound ? "Matikan suara" : "Nyalakan suara"}>
            <IconButton
              aria-label={sound ? "Matikan suara" : "Nyalakan suara"}
              onClick={() => {
                unlockAudio();
                setSound((v) => !v);
              }}
              sx={{ border: `1px solid ${palette.line}`, color: sound ? palette.lavender : palette.muted }}
            >
              {sound ? <VolumeOnIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <ConnectionChip connected={connected} />
        </>
      }
    >
      <Box
        onPointerDown={unlockAudio}
        sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 320px" }, alignItems: "start" }}
      >
        {/* ---------------- Papan urutan ---------------- */}
        <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 4, minHeight: 420 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 3 }}>
            <Typography variant="h5">Ronde {state.round}</Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 700,
                color: state.locked ? palette.gold : palette.success,
                border: `1px solid ${state.locked ? "rgba(245,196,81,0.4)" : "rgba(94,224,160,0.4)"}`,
              }}
            >
              {state.locked ? <LockIcon sx={{ fontSize: 15 }} /> : <LockOpenIcon sx={{ fontSize: 15 }} />}
              {state.locked ? "Pingo terkunci" : "Pingo terbuka"}
            </Box>
          </Box>

          {!first ? (
            <Box sx={{ textAlign: "center", py: { xs: 6, md: 9 } }}>
              <Box sx={{ position: "relative", width: 96, height: 96, mx: "auto", mb: 3 }} aria-hidden>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      inset: i * 16,
                      borderRadius: "50%",
                      border: `2px solid rgba(156,130,255,${0.55 - i * 0.15})`,
                    }}
                  />
                ))}
              </Box>
              <Typography variant="h5">Menunggu buzz pertama</Typography>
              <Typography sx={{ color: palette.muted, mt: 1 }}>
                Nama pemain akan muncul di sini begitu ada yang menekan buzzer.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Juara pertama — elemen utama halaman */}
              <Box
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  background: `linear-gradient(150deg, ${palette.plumHigh}, ${palette.plum})`,
                  border: `1px solid rgba(245,196,81,0.45)`,
                  textAlign: "center",
                  mb: rest.length ? 2 : 0,
                }}
              >
                <Typography sx={{ color: palette.gold, fontWeight: 700 }}>Tercepat</Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 800,
                    fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
                    lineHeight: 1.1,
                    mt: 1,
                    overflowWrap: "anywhere",
                  }}
                >
                  {first.name}
                </Typography>
              </Box>

              {rest.length > 0 && (
                <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
                  {rest.map((e) => (
                    <Box
                      component="li"
                      key={`${e.rank}-${e.name}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2.5,
                        backgroundColor: "rgba(20,10,43,0.5)",
                        border: `1px solid ${palette.line}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          backgroundColor: "rgba(124,92,240,0.25)",
                          color: palette.lavender,
                        }}
                      >
                        {e.rank}
                      </Box>
                      <Typography sx={{ flex: 1, fontWeight: 700, fontSize: 20, overflowWrap: "anywhere" }}>
                        {e.name}
                      </Typography>
                      <Typography sx={{ color: palette.muted, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                        +{e.delta} ms
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* ---------------- Panel kontrol ---------------- */}
        <Paper sx={{ p: 3, borderRadius: 4, display: "grid", gap: 2 }}>
          <Typography variant="h6">Kontrol ronde</Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            disabled={!controlsEnabled}
            onClick={() => socket.emit("admin:reset")}
          >
            Reset ronde
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={state.locked ? <LockOpenIcon /> : <LockIcon />}
            disabled={!controlsEnabled}
            onClick={() => socket.emit("admin:lock", !state.locked)}
          >
            {state.locked ? "Buka buzzer" : "Kunci buzzer"}
          </Button>

          <Box sx={{ borderTop: `1px solid ${palette.line}`, pt: 2, mt: 0.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Tautan pemain</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                size="small"
                fullWidth
                value={playerUrl}
                onFocus={(e) => e.target.select()}
                slotProps={{ htmlInput: { readOnly: true, "aria-label": "Tautan untuk pemain" } }}
              />
              <Tooltip title={copied ? "Tersalin" : "Salin tautan"}>
                <IconButton
                  aria-label="Salin tautan pemain"
                  onClick={copyLink}
                  sx={{ border: `1px solid ${palette.line}`, color: copied ? palette.success : palette.lavender }}
                >
                  {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography sx={{ color: palette.muted, fontSize: 13, mt: 1 }}>
              Bagikan ke peserta agar mereka bisa langsung ikut bermain.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ---------------- Dialog PIN ---------------- */}
      <Dialog open={auth === "need_pin"} fullWidth maxWidth="xs">
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (pinDraft) authenticate(pinDraft);
          }}
        >
          <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 700 }}>Masukkan PIN host</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: palette.muted, mb: 2 }}>
              Panel ini dilindungi PIN supaya peserta tidak bisa mereset ronde.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              type="password"
              label="PIN"
              value={pinDraft}
              onChange={(e) => setPinDraft(e.target.value)}
              error={pinError}
              helperText={pinError ? "PIN salah. Coba lagi." : " "}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button type="submit" variant="contained" disabled={!pinDraft || !connected}>
              Buka panel host
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Shell>
  );
}
