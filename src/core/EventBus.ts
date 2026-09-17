export type EventCallback<T = unknown> = (payload: T) => void;

export class EventBus {
    private listeners: Map<string, Set<EventCallback<never>>> = new Map();

    /**
     * Subscribe to an event. Returns an unsubscribe function.
     */
    on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback as EventCallback<never>);

        return () => this.off(event, callback as EventCallback<never>);
    }

    /**
     * Subscribe to an event exactly once.
     */
    once<T = unknown>(event: string, callback: EventCallback<T>): () => void {
        const remove = this.on(event, (payload: T) => {
            remove();
            callback(payload as T);
        });
        return remove;
    }

    /**
     * Unsubscribe a specific callback from an event.
     */
    off(event: string, callback: EventCallback<never>): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback as EventCallback<never>);
            if (callbacks.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Emit an event to all subscribers (supports wildcard '*' listeners).
     */
    emit<T = unknown>(event: string, payload?: T): void {
        // 1. Direct event listeners
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((cb) => cb(payload as never));
        }

        // 2. Catch-all / Wildcard listeners
        const wildcardCallbacks = this.listeners.get("*");
        if (wildcardCallbacks && event !== "*") {
            wildcardCallbacks.forEach((cb) => cb({ event, payload } as never));
        }
    }

    /**
     * Remove all registered listeners.
     */
    clear(): void {
        this.listeners.clear();
    }
}

export const eventBus = new EventBus();
