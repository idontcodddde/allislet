export type EventCallback<T = unknown> = (payload: T) => void;
export declare class EventBus {
    private listeners;
    /**
     * Subscribe to an event. Returns an unsubscribe function.
     */
    on<T = unknown>(event: string, callback: EventCallback<T>): () => void;
    /**
     * Subscribe to an event exactly once.
     */
    once<T = unknown>(event: string, callback: EventCallback<T>): () => void;
    /**
     * Unsubscribe a specific callback from an event.
     */
    off(event: string, callback: EventCallback<never>): void;
    /**
     * Emit an event to all subscribers (supports wildcard '*' listeners).
     */
    emit<T = unknown>(event: string, payload?: T): void;
    /**
     * Remove all registered listeners.
     */
    clear(): void;
}
export declare const eventBus: EventBus;
