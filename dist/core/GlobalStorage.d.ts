export interface StorageOptions {
    namespace?: string;
    crossDomainHubUrl?: string;
    encryptLocalStorage?: boolean;
}
export declare class GlobalStorage {
    private namespace;
    private hubUrl?;
    private encrypt;
    private iframe;
    private pendingRequests;
    isReady: Promise<void>;
    constructor(options?: StorageOptions);
    configure(options?: StorageOptions): void;
    init(options?: StorageOptions): Promise<void>;
    /**
     * Synchronously reads directly from LocalStorage.
     * Used for initializing signals before initial UI mount without race conditions.
     */
    getSync<T = unknown>(key: string): T | null;
    private initHub;
    private request;
    private executeLocal;
    get<T = unknown>(key: string): Promise<T | null>;
    set(key: string, value: unknown): Promise<boolean>;
    remove(key: string): Promise<boolean>;
    clear(): Promise<boolean>;
}
export declare const storage: GlobalStorage;
