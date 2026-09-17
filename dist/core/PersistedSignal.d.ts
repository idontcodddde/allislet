import { Signal } from '@preact/signals';
import { GlobalStorage } from './GlobalStorage';
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
export declare function useSignal<T>(sig: Signal<T>): T;
export declare function createPersistedSignal<T>({ key, defaultValue, storage, }: PersistOptions<T>): PersistedSignal<T>;
