export const DEFAULT_SOCKET_URL =
    typeof window !== "undefined" && window.location.protocol === "https:"
        ? "wss://localhost:5180/ws"
        : "ws://localhost:5180/ws";

export const SOCKET_URL = DEFAULT_SOCKET_URL;
