/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL server Socket.io, contoh: https://ping-server.onrender.com */
  readonly VITE_SOCKET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
