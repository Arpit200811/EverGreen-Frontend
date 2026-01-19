import { io } from "socket.io-client";

const token = localStorage.getItem("token"); 
const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});
// https://evergreen-backend-kgck.onrender.com
//http://localhost:5000