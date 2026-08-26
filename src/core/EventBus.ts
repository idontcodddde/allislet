export type EventCallback<T = any> = (payload: T) => void;

export class EventBus {
    private listeners: Map<string, Set<EventCallback>> = new Map();

    /**
     * Subscribe to an event. Returns an unsubscribe function.
     */
    on<T = any>(event: string, callback: EventCallback<T>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event exactly once.
     */
    once<T = any>(event: string, callback: EventCallback<T>): () => void {
        const remove = this.on(event, (payload: T) => {
            remove();
            callback(payload);
        });
        return remove;
    }

    /**
     * Unsubscribe a specific callback from an event.
     */
    off(event: string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Emit an event to all subscribers (supports wildcard '*' listeners).
     */
    emit<T = any>(event: string, payload?: T): void {
        // 1. Direct event listeners
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((cb) => cb(payload));
        }

        // 2. Catch-all / Wildcard listeners
        const wildcardCallbacks = this.listeners.get("*");
        if (wildcardCallbacks && event !== "*") {
            wildcardCallbacks.forEach((cb) => cb({ event, payload }));
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
