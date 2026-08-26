import { EventBus, eventBus } from "./EventBus";
import { WSFrameEvent } from "./WebSocketManager";

export class WebSocketSniffer {
    private isAttached = false;
    private frameBuffer: WSFrameEvent[] = [];
    private maxBufferSize = 500;
    private bus: EventBus;
    private unsubscribeFns: Array<() => void> = [];

    constructor(bus: EventBus = eventBus) {
        this.bus = bus;
    }

    /**
     * Monitors incoming, outgoing, connect, and disconnect frames across all sockets or a target socket ID.
     */
    attach(targetSocketId?: string): void {
        if (this.isAttached) return;

        const incomingTopic = targetSocketId
            ? `ws:${targetSocketId}:incoming`
            : "ws:incoming";
        const outgoingTopic = targetSocketId
            ? `ws:${targetSocketId}:outgoing`
            : "ws:outgoing";
        const connectTopic = targetSocketId
            ? `ws:${targetSocketId}:connect`
            : "ws:connect";
        const disconnectTopic = targetSocketId
            ? `ws:${targetSocketId}:disconnect`
            : "ws:disconnect";

        this.unsubscribeFns.push(
            this.bus.on(
                incomingTopic,
                (evt: WSFrameEvent) => this.recordFrame(evt),
            ),
            this.bus.on(
                outgoingTopic,
                (evt: WSFrameEvent) => this.recordFrame(evt),
            ),
            this.bus.on(
                connectTopic,
                (evt: WSFrameEvent) => this.recordFrame(evt),
            ),
            this.bus.on(
                disconnectTopic,
                (evt: WSFrameEvent) => this.recordFrame(evt),
            ),
        );

        this.isAttached = true;
        this.bus.emit("sniffer:attached", { targetSocketId });
    }

    /**
     * Detaches all active listeners and stops sniffing.
     */
    detach(): void {
        this.unsubscribeFns.forEach((unsub) => unsub());
        this.unsubscribeFns = [];
        this.isAttached = false;
        this.bus.emit("sniffer:detached");
    }

    private recordFrame(evt: WSFrameEvent): void {
        this.frameBuffer.push(evt);
        if (this.frameBuffer.length > this.maxBufferSize) {
            this.frameBuffer.shift();
        }
        this.bus.emit("sniffer:frame", evt);
    }

    getBuffer(): WSFrameEvent[] {
        return [...this.frameBuffer];
    }

    clearBuffer(): void {
        this.frameBuffer = [];
        this.bus.emit("sniffer:cleared");
    }
}

export const wsSniffer = new WebSocketSniffer();
