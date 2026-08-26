export interface ServiceWorkerOptions {
    scriptUrl?: string;
    scope?: string;
}

export class ServiceWorkerRegistrar {
    private scriptUrl?: string;
    private scope?: string;

    constructor(options: ServiceWorkerOptions = {}) {
        this.scriptUrl = options.scriptUrl;
        this.scope = options.scope;
    }

    /**
     * Programmatically registers a Service Worker using configured options or explicit arguments.
     */
    public async register(
        scriptUrl?: string,
        scope?: string,
    ): Promise<ServiceWorkerRegistration | null> {
        if (!("serviceWorker" in navigator)) {
            console.warn(
                "[ServiceWorkerRegistrar] Service Workers are not supported in this browser context.",
            );
            return null;
        }

        const targetUrl = scriptUrl || this.scriptUrl;
        const targetScope = scope || this.scope;

        if (!targetUrl) {
            throw new Error(
                "[ServiceWorkerRegistrar] Cannot register: No scriptUrl provided.",
            );
        }

        try {
            const registration = await navigator.serviceWorker.register(
                targetUrl,
                targetScope ? { scope: targetScope } : undefined,
            );
            console.log(
                `[ServiceWorkerRegistrar] Service Worker registered under scope: ${registration.scope}`,
            );
            return registration;
        } catch (error) {
            console.error(
                "[ServiceWorkerRegistrar] Failed to register Service Worker:",
                error,
            );
            throw error;
        }
    }

    /**
     * Unregisters all active service worker registrations on the host page domain in one call.
     */
    public async unregisterAll(): Promise<boolean> {
        if (!("serviceWorker" in navigator)) {
            console.warn(
                "[ServiceWorkerRegistrar] Service Workers are not supported in this browser context.",
            );
            return false;
        }

        try {
            const registrations = await navigator.serviceWorker
                .getRegistrations();
            if (registrations.length === 0) {
                console.log(
                    "[ServiceWorkerRegistrar] No active service workers found to unregister.",
                );
                return true;
            }

            const results = await Promise.all(
                registrations.map((registration) => registration.unregister()),
            );

            const allUnregistered = results.every(Boolean);
            console.log(
                `[ServiceWorkerRegistrar] Unregistered ${registrations.length} Service Worker(s). Success: ${allUnregistered}`,
            );
            return allUnregistered;
        } catch (error) {
            console.error(
                "[ServiceWorkerRegistrar] Error during unregisterAll:",
                error,
            );
            return false;
        }
    }

    /**
     * Unregisters a specific service worker matching the given scope or script URL.
     */
    public async unregister(scopeOrScriptUrl: string): Promise<boolean> {
        if (!("serviceWorker" in navigator)) {
            console.warn(
                "[ServiceWorkerRegistrar] Service Workers are not supported in this browser context.",
            );
            return false;
        }

        try {
            const registrations = await navigator.serviceWorker
                .getRegistrations();
            const target = registrations.find((reg) => {
                const activeUrl = reg.active?.scriptURL ||
                    reg.installing?.scriptURL || reg.waiting?.scriptURL;
                return reg.scope === scopeOrScriptUrl ||
                    activeUrl === scopeOrScriptUrl;
            });

            if (!target) {
                console.warn(
                    `[ServiceWorkerRegistrar] No active worker found matching: "${scopeOrScriptUrl}"`,
                );
                return false;
            }

            const success = await target.unregister();
            console.log(
                `[ServiceWorkerRegistrar] Unregistered worker "${scopeOrScriptUrl}": ${success}`,
            );
            return success;
        } catch (error) {
            console.error(
                `[ServiceWorkerRegistrar] Failed to unregister "${scopeOrScriptUrl}":`,
                error,
            );
            return false;
        }
    }

    /**
     * Subscribes to postMessages received from navigator.serviceWorker.
     * Returns an cleanup function to remove the listener.
     */
    public interceptMessages(
        callback: (data: any, event: MessageEvent) => void,
    ): () => void {
        if (!("serviceWorker" in navigator)) {
            console.warn(
                "[ServiceWorkerRegistrar] Service Workers are not supported in this browser context.",
            );
            return () => {};
        }

        const handleMessage = (event: MessageEvent) => {
            callback(event.data, event);
        };

        navigator.serviceWorker.addEventListener("message", handleMessage);

        return () => {
            navigator.serviceWorker.removeEventListener(
                "message",
                handleMessage,
            );
        };
    }
}

export const swRegistrar = new ServiceWorkerRegistrar();
