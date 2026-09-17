import { EventBus } from './EventBus';
import { WSFrameEvent } from './WebSocketManager';
export declare class WebSocketSniffer {
    private isAttached;
    private frameBuffer;
    private maxBufferSize;
    private bus;
    private unsubscribeFns;
    constructor(bus?: EventBus);
    /**
     * Monitors incoming, outgoing, connect, and disconnect frames across all sockets or a target socket ID.
     */
    attach(targetSocketId?: string): void;
    /**
     * Detaches all active listeners and stops sniffing.
     */
    detach(): void;
    private recordFrame;
    getBuffer(): WSFrameEvent[];
    clearBuffer(): void;
}
export declare const wsSniffer: WebSocketSniffer;
