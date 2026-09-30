import { io } from "socket.io-client";

/**
 * Alamat server:
 *  1. VITE_SOCKET_URL (disarankan untuk production)
 *  2. saat `npm run dev`: server lokal di port 4000 pada host yang sama
 *     (jadi HP di jaringan WiFi yang sama ikut bisa terhubung)
 *  3. fallback ke alamat lama
 */
const PROD_FALLBACK = "https://buzz-nexus-art-be.vercel.app";

export const SERVER_URL: string =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:4000` : PROD_FALLBACK);

// autoConnect dimatikan: koneksi dibuka per halaman lewat useBuzzSocket.
export const socket = io(SERVER_URL, { autoConnect: false });

const CLIENT_ID_KEY = "buzz:clientId";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // crypto.randomUUID tidak tersedia di http:// non-localhost (mis. akses lewat IP LAN)
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** ID anonim yang tetap sama meski halaman di-refresh, supaya status buzz tidak hilang. */
export function getClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = createId();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return createId();
  }
}
