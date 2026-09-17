export interface ServiceWorkerOptions {
    scriptUrl?: string;
    scope?: string;
}
export declare class ServiceWorkerRegistrar {
    private scriptUrl?;
    private scope?;
    constructor(options?: ServiceWorkerOptions);
    /**
     * Programmatically registers a Service Worker using configured options or explicit arguments.
     */
    register(scriptUrl?: string, scope?: string): Promise<ServiceWorkerRegistration | null>;
    /**
     * Unregisters all active service worker registrations on the host page domain in one call.
     */
    unregisterAll(): Promise<boolean>;
    /**
     * Unregisters a specific service worker matching the given scope or script URL.
     */
    unregister(scopeOrScriptUrl: string): Promise<boolean>;
    /**
     * Subscribes to postMessages received from navigator.serviceWorker.
     * Returns an cleanup function to remove the listener.
     */
    interceptMessages(callback: (data: unknown, event: MessageEvent<unknown>) => void): () => void;
}
export declare const swRegistrar: ServiceWorkerRegistrar;
