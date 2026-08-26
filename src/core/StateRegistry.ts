import { batch, Signal, signal } from "@preact/signals";
import { GlobalStorage, storage as singletonStorage } from "./GlobalStorage";
import { EventBus, eventBus as singletonEventBus } from "./EventBus";

interface RegisteredItem<T = any> {
    key: string;
    sig: Signal<T>;
    defaultValue: T;
    isWriting: boolean;
    isHydrated: boolean;
}

export class StateRegistry {
    private items = new Map<string, RegisteredItem>();
    private storage: GlobalStorage;
    private eventBus: EventBus;

    constructor(
        storageInstance?: GlobalStorage,
        eventBusInstance?: EventBus,
    ) {
        this.storage = storageInstance || singletonStorage;
        this.eventBus = eventBusInstance || singletonEventBus;
    }

    register<T>(key: string, defaultValue: T): Signal<T> {
        if (this.items.has(key)) {
            return this.items.get(key)!.sig as Signal<T>;
        }

        const syncedValue = this.storage.getSync<T>(key);
        const initialValue = syncedValue !== null && syncedValue !== undefined
            ? syncedValue
            : defaultValue;

        const sig = signal<T>(initialValue);
        const item: RegisteredItem<T> = {
            key,
            sig,
            defaultValue,
            isWriting: false,
            isHydrated: false,
        };

        sig.subscribe((newValue) => {
            if (!item.isHydrated || item.isWriting) return;

            item.isWriting = true;
            this.storage.set(key, newValue).finally(() => {
                item.isWriting = false;
            });
        });

        this.items.set(key, item);
        return sig;
    }

    async hydrateAll(): Promise<void> {
        console.log("[Allislet State] Waiting for cross-origin storage hub...");
        await this.storage.isReady;
        console.log(
            "[Allislet State] Storage hub ready! Beginning hydration...",
        );

        for (const item of this.items.values()) {
            try {
                console.log(
                    `[Allislet State] Fetching remote value for: "${item.key}"`,
                );

                const storedValue = await this.storage.get(item.key);
                console.log(
                    `[Allislet State] Retrieved "${item.key}" =`,
                    storedValue,
                );

                if (storedValue !== null && storedValue !== undefined) {
                    item.isWriting = true;
                    batch(() => {
                        item.sig.value = storedValue;
                    });
                    item.isWriting = false;
                    console.log(
                        `[Allislet State] Applied "${item.key}" to UI signal.`,
                    );
                } else {
                    console.log(
                        `[Allislet State] No remote data for "${item.key}". Keeping default: "${item.sig.value}"`,
                    );
                }
            } catch (err) {
                console.warn(
                    `[Allislet State] Hydration error for key "${item.key}":`,
                    err,
                );
            } finally {
                item.isHydrated = true;
            }
        }

        this.eventBus.emit("state:hydrated", { timestamp: Date.now() });
        console.log("[Allislet State] Hydration sequence complete.");
    }

    getSignal<T>(key: string): Signal<T> | undefined {
        return this.items.get(key)?.sig as Signal<T> | undefined;
    }
}

export const stateRegistry = new StateRegistry();
