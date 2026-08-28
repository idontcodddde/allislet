export const DEFAULT_SOCKET_URL =
    typeof window !== "undefined" && window.location.protocol === "https:"
        ? "wss://localhost:8080/ws"
        : "ws://localhost:8080/ws";

export const SOCKET_URL = DEFAULT_SOCKET_URL;
