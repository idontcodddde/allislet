export interface BroadcastMessage<T = unknown> {
    type: string;
    payload: T;
    senderId: string;
}
export declare class TabBroadcast {
    private channel;
    private listeners;
    private senderId;
    constructor(channelName?: string);
    post<T = unknown>(type: string, payload?: T): void;
    on<T = unknown>(type: string, callback: (payload: T) => void): () => void;
    private handleMessage;
    destroy(): void;
}
