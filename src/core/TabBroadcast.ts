export interface BroadcastMessage<T = any> {
    type: string;
    payload: T;
    senderId: string;
}

export class TabBroadcast {
    private channel: BroadcastChannel | null = null;
    private listeners: Map<string, Set<(payload: any) => void>> = new Map();
    private senderId: string = Math.random().toString(36).substring(2, 9);

    constructor(channelName: string = "app_tab_broadcast") {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            this.channel = new BroadcastChannel(channelName);
            this.channel.onmessage = this.handleMessage;
        }
    }

    public post<T = any>(type: string, payload?: T): void {
        if (!this.channel) return;
        const msg: BroadcastMessage<T> = {
            type,
            payload: payload as T,
            senderId: this.senderId,
        };
        this.channel.postMessage(msg);
    }

    public on<T = any>(
        type: string,
        callback: (payload: T) => void,
    ): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        const set = this.listeners.get(type)!;
        set.add(callback);

        return () => {
            set.delete(callback);
            if (set.size === 0) this.listeners.delete(type);
        };
    }

    private handleMessage = (event: MessageEvent<BroadcastMessage>): void => {
        const { type, payload, senderId } = event.data || {};
        if (senderId === this.senderId) return;

        const callbacks = this.listeners.get(type);
        if (callbacks) {
            callbacks.forEach((cb) => cb(payload));
        }
    };

    public destroy(): void {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
        this.listeners.clear();
    }
}
