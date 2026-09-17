import { Signal } from '@preact/signals';
import { GlobalStorage } from './GlobalStorage';
import { EventBus } from './EventBus';
export declare class StateRegistry {
    private items;
    private storage;
    private eventBus;
    constructor(storageInstance?: GlobalStorage, eventBusInstance?: EventBus);
    register<T>(key: string, defaultValue: T): Signal<T>;
    hydrateAll(): Promise<void>;
    getSignal<T>(key: string): Signal<T> | undefined;
}
export declare const stateRegistry: StateRegistry;
