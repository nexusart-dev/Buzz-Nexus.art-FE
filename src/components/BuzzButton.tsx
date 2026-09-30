import { keyframes } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fontDisplay, palette } from "../theme";
import { CheckIcon, LockIcon } from "./icons";

const ring = keyframes`
  0%   { transform: scale(1);    opacity: .55; }
  100% { transform: scale(1.32); opacity: 0; }
`;

type Props = {
  variant: "ready" | "locked" | "offline" | "buzzed";
  onPress: () => void;
};

const SIZE = "clamp(220px, 68vw, 320px)";

export default function BuzzButton({ variant, onPress }: Props) {
  const ready = variant === "ready";
  const buzzed = variant === "buzzed";

  const face = ready
    ? `radial-gradient(circle at 50% 30%, #9C82FF 0%, ${palette.violet} 45%, ${palette.violetDeep} 100%)`
    : buzzed
      ? `radial-gradient(circle at 50% 30%, #E6DEFF 0%, ${palette.lavender} 60%, #A995F0 100%)`
      : "radial-gradient(circle at 50% 30%, #3B2C73 0%, #2A1D57 100%)";

  return (
    <Box sx={{ position: "relative", width: SIZE, height: SIZE, display: "grid", placeItems: "center" }}>
      {ready && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${palette.violet}`,
            animation: `${ring} 2s ease-out infinite`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 0.25 },
          }}
        />
      )}
      <ButtonBase
        disabled={!ready}
        aria-label={ready ? "Tekan untuk buzz" : buzzed ? "Sudah buzz" : "Buzzer tidak aktif"}
        // pointerdown → respons lebih cepat daripada menunggu click; Enter/Space tetap lewat click keyboard.
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button === 0) onPress();
        }}
        onClick={(e) => {
          if (e.detail === 0) onPress();
        }}
        sx={{
          width: "88%",
          height: "88%",
          borderRadius: "50%",
          background: face,
          color: buzzed ? palette.ink : "#fff",
          flexDirection: "column",
          gap: 0.5,
          touchAction: "manipulation",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          boxShadow: ready
            ? `0 10px 0 ${palette.violetDeep}, 0 24px 48px rgba(124,92,240,0.45), inset 0 2px 0 rgba(255,255,255,0.35)`
            : `0 4px 0 rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.12)`,
          transform: ready ? "translateY(0)" : "translateY(6px)",
          transition: "transform .08s ease, box-shadow .08s ease, background .25s ease",
          "&:active": ready
            ? {
                transform: "translateY(8px)",
                boxShadow: `0 2px 0 ${palette.violetDeep}, 0 8px 20px rgba(124,92,240,0.4), inset 0 2px 0 rgba(255,255,255,0.35)`,
              }
            : undefined,
          "&:focus-visible": { outline: `3px solid ${palette.lavender}`, outlineOffset: 8 },
          "&.Mui-disabled": { color: buzzed ? palette.ink : "rgba(243,240,255,0.45)" },
        }}
      >
        {buzzed ? (
          <CheckIcon sx={{ fontSize: 88 }} />
        ) : variant === "locked" ? (
          <LockIcon sx={{ fontSize: 64 }} />
        ) : (
          <Typography
            component="span"
            sx={{ fontFamily: fontDisplay, fontWeight: 800, fontSize: "clamp(40px, 12vw, 56px)", letterSpacing: "-0.02em" }}
          >
            {variant === "offline" ? "…" : "Pingo!"}
          </Typography>
        )}
      </ButtonBase>
    </Box>
  );
}
