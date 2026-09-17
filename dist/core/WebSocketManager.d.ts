import { EventBus } from './EventBus';
export interface WSFrameEvent {
    id: string;
    url: string;
    direction: "inbound" | "outbound";
    data: string | ArrayBuffer | Blob | ArrayBufferView;
    timestamp: number;
}
export type WSListenerCallback = (event: WSFrameEvent) => void;
export declare class WebSocketManager {
    private NativeWebSocket;
    private activeSockets;
    private lockedPatterns;
    private bus;
    private isHooked;
    constructor(bus?: EventBus);
    /**
     * Patches window.WebSocket to intercept all new connections.
     */
    hook(): void;
    /**
     * Restores original window.WebSocket behavior.
     */
    unhook(): void;
    /**
     * Forces a target socket closed and prevents host site from auto-reconnecting.
     */
    forceDisconnect(id: string): void;
    /**
     * Silently drops any host page attempt to open WebSockets matching the target URL pattern.
     */
    lockClosed(pattern: string | RegExp): void;
    /**
     * Subscribes to socket frame streams directly via EventBus.
     */
    listen(event: "ws:incoming" | "ws:outgoing" | "ws:connect" | "ws:disconnect" | string, callback: (data: WSFrameEvent) => void): () => void;
    /**
     * Injects custom frame data directly into an active WebSocket channel.
     * - inbound: Simulates a frame received from server to the browser UI.
     * - outbound: Sends raw frame payload to the target server over the active socket.
     */
    injectFrame(id: string, payload: string | ArrayBuffer | Blob, direction?: "inbound" | "outbound"): void;
    /**
     * Returns list of currently active socket connections.
     */
    getActiveSockets(): {
        id: string;
        url: string;
        readyState: number;
    }[];
}
export declare const wsManager: WebSocketManager;
