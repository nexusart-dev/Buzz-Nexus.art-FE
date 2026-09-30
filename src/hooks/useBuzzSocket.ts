import { useEffect, useRef, useState } from "react";
import { getClientId, socket } from "../socket";
import type { Me, Role, RoundState } from "../types";

const INITIAL: RoundState = { round: 1, locked: false, players: 0, entries: [] };

/**
 * Membuka koneksi socket untuk halaman ini dan menyinkronkan state ronde dari server.
 * `onConnect` dipanggil setiap kali (re)connect berhasil — dipakai host untuk autentikasi ulang.
 */
export function useBuzzSocket(role: Role, onConnect?: () => void) {
  const [connected, setConnected] = useState(socket.connected);
  const [state, setState] = useState<RoundState>(INITIAL);
  const [me, setMe] = useState<Me>({ rank: null });

  const onConnectRef = useRef(onConnect);
  useEffect(() => {
    onConnectRef.current = onConnect;
  });

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      onConnectRef.current?.();
    };
    const handleDisconnect = () => setConnected(false);
    const handleState = (next: RoundState) => setState(next);
    const handleMe = (next: Me) => setMe(next);

    socket.auth = { clientId: getClientId(), role };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("state", handleState);
    socket.on("me", handleMe);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("state", handleState);
      socket.off("me", handleMe);
      socket.disconnect();
    };
  }, [role]);

  return { connected, state, me };
}
