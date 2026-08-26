import { EventBus, eventBus } from "./EventBus";

export interface WSFrameEvent {
    id: string;
    url: string;
    direction: "inbound" | "outbound";
    data: string | ArrayBuffer | Blob | ArrayBufferView;
    timestamp: number;
}

export type WSListenerCallback = (event: WSFrameEvent) => void;

export class WebSocketManager {
    private NativeWebSocket = window.WebSocket;
    private activeSockets: Map<
        string,
        { socket: WebSocket; url: string; autoReconnectBlocked: boolean }
    > = new Map();
    private lockedPatterns: Array<string | RegExp> = [];
    private bus: EventBus;
    private isHooked = false;

    constructor(bus: EventBus = eventBus) {
        this.bus = bus;
    }

    /**
     * Patches window.WebSocket to intercept all new connections.
     */
    public hook(): void {
        if (this.isHooked) return;
        const self = this;

        const InterceptedWebSocket = function (
            this: WebSocket,
            url: string | URL,
            protocols?: string | string[],
        ) {
            const urlStr = url.toString();

            // Check if URL matches any locked pattern
            const isLocked = self.lockedPatterns.some((pattern) =>
                typeof pattern === "string"
                    ? urlStr.includes(pattern)
                    : pattern.test(urlStr)
            );

            if (isLocked) {
                console.warn(
                    `[Allislet WebSocket] Blocked connection attempt to: ${urlStr}`,
                );
                const dummySocket = new self.NativeWebSocket(
                    "ws://127.0.0.1:0",
                );
                dummySocket.close();
                return dummySocket;
            }

            const instance = new self.NativeWebSocket(urlStr, protocols);
            const id = "ws_" + Math.random().toString(36).substring(2, 9);

            self.activeSockets.set(id, {
                socket: instance,
                url: urlStr,
                autoReconnectBlocked: false,
            });

            // Override send to intercept outgoing frames
            const originalSend = instance.send.bind(instance);
            instance.send = function (data: Parameters<WebSocket["send"]>[0]) {
                const record = self.activeSockets.get(id);
                if (
                    record?.autoReconnectBlocked &&
                    instance.readyState !== self.NativeWebSocket.OPEN
                ) {
                    return;
                }

                const payload: WSFrameEvent = {
                    id,
                    url: urlStr,
                    direction: "outbound",
                    data: data as string | ArrayBuffer | Blob,
                    timestamp: Date.now(),
                };

                self.bus.emit("ws:outgoing", payload);
                self.bus.emit(`ws:${id}:outgoing`, payload);

                return originalSend(data);
            };

            // Hook incoming message listeners
            instance.addEventListener("message", (event: MessageEvent) => {
                const payload: WSFrameEvent = {
                    id,
                    url: urlStr,
                    direction: "inbound",
                    data: event.data,
                    timestamp: Date.now(),
                };

                self.bus.emit("ws:incoming", payload);
                self.bus.emit(`ws:${id}:incoming`, payload);
            });

            instance.addEventListener("open", () => {
                const payload: WSFrameEvent = {
                    id,
                    url: urlStr,
                    direction: "inbound",
                    data: "CONNECTED",
                    timestamp: Date.now(),
                };

                self.bus.emit("ws:connect", payload);
                self.bus.emit(`ws:${id}:connect`, payload);
            });

            instance.addEventListener("close", () => {
                self.activeSockets.delete(id);
                const payload: WSFrameEvent = {
                    id,
                    url: urlStr,
                    direction: "inbound",
                    data: "DISCONNECTED",
                    timestamp: Date.now(),
                };

                self.bus.emit("ws:disconnect", payload);
                self.bus.emit(`ws:${id}:disconnect`, payload);
            });

            (instance as any).__allislet_id = id;

            return instance;
        } as unknown as typeof WebSocket;

        InterceptedWebSocket.prototype = this.NativeWebSocket.prototype;
        Object.assign(InterceptedWebSocket, this.NativeWebSocket);

        window.WebSocket = InterceptedWebSocket;
        this.isHooked = true;
    }

    /**
     * Restores original window.WebSocket behavior.
     */
    public unhook(): void {
        if (!this.isHooked) return;
        window.WebSocket = this.NativeWebSocket;
        this.isHooked = false;
    }

    /**
     * Forces a target socket closed and prevents host site from auto-reconnecting.
     */
    forceDisconnect(id: string): void {
        const entry = this.activeSockets.get(id);
        if (!entry) return;

        entry.autoReconnectBlocked = true;
        entry.socket.close(1000, "Forced by Allislet WebSocketManager");
        this.activeSockets.delete(id);
    }

    /**
     * Silently drops any host page attempt to open WebSockets matching the target URL pattern.
     */
    lockClosed(pattern: string | RegExp): void {
        this.lockedPatterns.push(pattern);
    }

    /**
     * Subscribes to socket frame streams directly via EventBus.
     */
    listen(
        event:
            | "ws:incoming"
            | "ws:outgoing"
            | "ws:connect"
            | "ws:disconnect"
            | string,
        callback: (data: WSFrameEvent) => void,
    ): () => void {
        return this.bus.on(event, callback);
    }

    /**
     * Injects custom frame data directly into an active WebSocket channel.
     * - inbound: Simulates a frame received from server to the browser UI.
     * - outbound: Sends raw frame payload to the target server over the active socket.
     */
    injectFrame(
        id: string,
        payload: string | ArrayBuffer | Blob,
        direction: "inbound" | "outbound" = "inbound",
    ): void {
        const entry = this.activeSockets.get(id);
        if (!entry) {
            console.warn(`[Allislet WebSocket] Socket ID ${id} not found.`);
            return;
        }

        if (direction === "inbound") {
            const messageEvent = new MessageEvent("message", {
                data: payload,
                origin: window.location.origin,
            });
            entry.socket.dispatchEvent(messageEvent);
        } else {
            entry.socket.send(payload as Parameters<WebSocket["send"]>[0]);
        }
    }

    /**
     * Returns list of currently active socket connections.
     */
    getActiveSockets() {
        return Array.from(this.activeSockets.entries()).map(([id, item]) => ({
            id,
            url: item.url,
            readyState: item.socket.readyState,
        }));
    }
}

export const wsManager = new WebSocketManager();
