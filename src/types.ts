export type Role = "player" | "admin";

export type PublicEntry = { rank: number; name: string; delta: number };

export type RoundState = {
  round: number;
  locked: boolean;
  players: number;
  entries: PublicEntry[];
};

export type Me = { rank: number | null };

export type BuzzResult =
  | { ok: true; rank: number }
  | { ok: false; reason: "locked" | "already" | "invalid_name"; rank?: number };

export type AdminAuthResult = { ok: boolean; pinRequired: boolean };
