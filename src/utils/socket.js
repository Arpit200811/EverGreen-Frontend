import { io } from "socket.io-client";

// backend URL (same as API base)
const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL || "https://evergreen-backend-kgck.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});
