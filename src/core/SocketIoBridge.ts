export interface SocketIoConfig {
    url: string;
    namespace?: string;
    options?: Record<string, any>;
}

export class SocketIoBridge {
    private sockets: Map<string, any> = new Map();

    /**
     * Connects or reuses a socket.io connection for specified namespace.
     */
    connect(config: SocketIoConfig, ioClient?: any): any {
        const io = ioClient || (window as any).io;
        if (!io) {
            throw new Error(
                "[Allislet SocketIoBridge] socket.io-client global 'io' not found.",
            );
        }

        const namespace = config.namespace || "/";
        const fullUrl = `${config.url.replace(/\/$/, "")}${namespace}`;

        if (this.sockets.has(fullUrl)) {
            return this.sockets.get(fullUrl);
        }

        const socket = io(fullUrl, config.options);
        this.sockets.set(fullUrl, socket);
        return socket;
    }

    /**
     * Joins custom rooms across socket instances.
     */
    joinRoom(namespaceKey: string, room: string): void {
        const socket = this.sockets.get(namespaceKey);
        if (socket) {
            socket.emit("join", { room });
        }
    }

    /**
     * Standardized event emitter for multiplexed namespaces.
     */
    emit(namespaceKey: string, event: string, payload: any): void {
        const socket = this.sockets.get(namespaceKey);
        if (socket) {
            socket.emit(event, payload);
        }
    }

    /**
     * Disconnects a specific namespace socket or all bridged sockets.
     */
    disconnect(namespaceKey?: string): void {
        if (namespaceKey) {
            const socket = this.sockets.get(namespaceKey);
            socket?.disconnect();
            this.sockets.delete(namespaceKey);
        } else {
            this.sockets.forEach((s) => s.disconnect());
            this.sockets.clear();
        }
    }
}

export const socketIoBridge = new SocketIoBridge();
