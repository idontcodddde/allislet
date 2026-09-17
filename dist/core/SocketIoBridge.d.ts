export interface SocketIoConfig {
    url: string;
    namespace?: string;
    options?: Record<string, unknown>;
}
export interface SocketIoSocket {
    emit(event: string, payload: unknown): void;
    disconnect(): void;
}
export type SocketIoFactory = (url: string, options?: Record<string, unknown>) => SocketIoSocket;
export declare class SocketIoBridge {
    private sockets;
    /**
     * Connects or reuses a socket.io connection for specified namespace.
     */
    connect(config: SocketIoConfig, ioClient?: SocketIoFactory): SocketIoSocket;
    /**
     * Joins custom rooms across socket instances.
     */
    joinRoom(namespaceKey: string, room: string): void;
    /**
     * Standardized event emitter for multiplexed namespaces.
     */
    emit(namespaceKey: string, event: string, payload: unknown): void;
    /**
     * Disconnects a specific namespace socket or all bridged sockets.
     */
    disconnect(namespaceKey?: string): void;
}
export declare const socketIoBridge: SocketIoBridge;
