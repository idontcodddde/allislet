import { useEffect, useState } from "preact/hooks";
import { Signal, signal } from "@preact/signals";
import { GlobalStorage } from "./GlobalStorage";

export interface PersistOptions<T> {
    key: string;
    defaultValue: T;
    storage: GlobalStorage;
}

export interface PersistedSignal<T> {
    sig: Signal<T>;
    isHydrated: Signal<boolean>;
    init: () => Promise<void>;
    useValue: () => T;
}

export function useSignal<T>(sig: Signal<T>): T {
    const [value, setValue] = useState<T>(sig.value);

    useEffect(() => {
        setValue(sig.value);
        const unsubscribe = sig.subscribe((val) => setValue(val));
        return () => unsubscribe();
    }, [sig]);

    return sig.value;
}

export function createPersistedSignal<T>({
    key,
    defaultValue,
    storage,
}: PersistOptions<T>): PersistedSignal<T> {
    const sig = signal<T>(defaultValue);
    const isHydrated = signal<boolean>(false);
    let isWriting = false;

    sig.subscribe((newValue) => {
        if (!isHydrated.value || isWriting) return;

        isWriting = true;
        storage.set(key, newValue).finally(() => {
            isWriting = false;
        });
    });

    const init = async () => {
        try {
            await storage.isReady;
            const storedValue = await storage.get<T>(key);

            if (storedValue !== null && storedValue !== undefined) {
                isWriting = true;
                sig.value = storedValue;
                isWriting = false;
            }
        } catch (err) {
            console.warn(
                `[Allislet Storage] Failed to hydrate signal for key "${key}":`,
                err,
            );
        } finally {
            isHydrated.value = true;
        }
    };

    const useValue = () => useSignal(sig);

    return { sig, isHydrated, init, useValue };
}
