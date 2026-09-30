let ctx: AudioContext | null = null;

/** Harus dipanggil dari interaksi pengguna (klik) agar browser mengizinkan suara. */
export function unlockAudio() {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* browser tidak mendukung — abaikan */
  }
}

export function playBuzz() {
  try {
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(990, now + 0.12);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    /* abaikan */
  }
}
