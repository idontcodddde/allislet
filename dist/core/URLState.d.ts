export declare class URLState<T extends string | number | boolean> {
    private key;
    private defaultValue;
    private listeners;
    constructor(key: string, defaultValue: T);
    static bind<T extends string | number | boolean>(key: string, defaultValue: T): URLState<T>;
    get(): T;
    set(newValue: T): void;
    subscribe(cb: (val: T) => void): () => void;
    private notify;
    private handlePopState;
    destroy(): void;
}
