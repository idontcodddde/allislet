export interface StorageOptions {
    namespace?: string;
    crossDomainHubUrl?: string;
    encryptLocalStorage?: boolean;
}

export class GlobalStorage {
    private namespace: string = "allislet_default";
    private hubUrl?: string;
    private encrypt: boolean = false;
    private iframe: HTMLIFrameElement | null = null;
    private pendingRequests: Map<
        string,
        { resolve: (val: any) => void; reject: (err: any) => void }
    > = new Map();

    public isReady: Promise<void> = Promise.resolve();

    constructor(options?: StorageOptions) {
        if (options) {
            this.configure(options);
        }
    }

    public configure(options: StorageOptions = {}): void {
        this.namespace = options.namespace || "allislet_default";
        this.hubUrl = options.crossDomainHubUrl;
        this.encrypt = options.encryptLocalStorage ?? false;
        this.isReady = this.initHub();
    }

    public async init(options?: StorageOptions): Promise<void> {
        if (options && !this.hubUrl) {
            this.configure(options);
        }
        await this.isReady;
    }

    /**
     * Synchronously reads directly from LocalStorage.
     * Used for initializing signals before initial UI mount without race conditions.
     */
    public getSync<T = any>(key: string): T | null {
        const storeKey = `${this.namespace}:${key}`;
        const raw = localStorage.getItem(storeKey);
        if (raw === null || raw === undefined) {
            return null;
        }
        try {
            return this.encrypt
                ? JSON.parse(decodeURIComponent(atob(raw)))
                : JSON.parse(raw);
        } catch {
            return raw as unknown as T;
        }
    }

    private initHub(): Promise<void> {
        if (!this.hubUrl) return Promise.resolve();

        return new Promise((resolve) => {
            const iframe = document.createElement("iframe");
            iframe.src = this.hubUrl!;
            iframe.style.display = "none";
            this.iframe = iframe;

            const handleMessage = (event: MessageEvent) => {
                if (this.hubUrl && !this.hubUrl.startsWith(event.origin)) {
                    return;
                }

                const { id, result, value, error, success } = event.data || {};

                if (id && this.pendingRequests.has(id)) {
                    if (success === undefined && error === undefined) {
                        return;
                    }

                    const { resolve: res, reject: rej } = this.pendingRequests
                        .get(id)!;
                    this.pendingRequests.delete(id);

                    if (error || success === false) {
                        rej(new Error(error || "RPC Storage Operation Failed"));
                    } else {
                        res(result !== undefined ? result : value);
                    }
                }
            };

            window.addEventListener("message", handleMessage);

            const timeoutId = setTimeout(() => {
                console.warn(
                    `[GlobalStorage] Iframe RPC timed out loading from: ${this.hubUrl}`,
                );
                resolve();
            }, 2000);

            iframe.onload = () => {
                clearTimeout(timeoutId);
                resolve();
            };
            iframe.onerror = () => {
                clearTimeout(timeoutId);
                console.warn(
                    `[GlobalStorage] Failed to load Storage Hub iframe from: ${this.hubUrl}`,
                );
                resolve();
            };

            document.body.appendChild(iframe);
        });
    }

    private async request<T = any>(
        action: string,
        payload: { key?: string; value?: any } = {},
    ): Promise<T> {
        await this.isReady;

        const fullKey = `${this.namespace}:${payload.key || ""}`;

        if (!this.iframe || !this.hubUrl) {
            return this.executeLocal<T>(action, fullKey, payload.value);
        }

        return new Promise<T>((resolve, reject) => {
            const id = `rpc_${Date.now()}_${
                Math.random().toString(36).substring(2, 9)
            }`;

            const timeoutId = setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    console.warn(
                        `[GlobalStorage] RPC action "${action}" timed out for key "${payload.key}". Falling back to window.localStorage.`,
                    );
                    resolve(
                        this.executeLocal<T>(action, fullKey, payload.value),
                    );
                }
            }, 1500);

            this.pendingRequests.set(id, {
                resolve: (val) => {
                    clearTimeout(timeoutId);
                    resolve(val);
                },
                reject: (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                },
            });

            const targetOrigin = new URL(this.hubUrl!).origin;

            const typeAction = action === "get"
                ? "ALLISLET_STORAGE_GET"
                : action === "set"
                ? "ALLISLET_STORAGE_SET"
                : `ALLISLET_STORAGE_${action.toUpperCase()}`;

            this.iframe!.contentWindow?.postMessage(
                {
                    id,
                    type: typeAction,
                    action,
                    namespace: this.namespace,
                    key: fullKey,
                    value: payload.value,
                    encrypt: this.encrypt,
                },
                targetOrigin,
            );
        });
    }

    private executeLocal<T = any>(
        action: string,
        storeKey: string,
        value?: any,
    ): T {
        if (action === "set") {
            const val = this.encrypt
                ? btoa(encodeURIComponent(JSON.stringify(value)))
                : JSON.stringify(value);
            localStorage.setItem(storeKey, val);
            return true as unknown as T;
        }

        if (action === "get") {
            const raw = localStorage.getItem(storeKey);
            if (raw === null || raw === undefined) {
                return null as unknown as T;
            }
            try {
                const decoded = this.encrypt
                    ? JSON.parse(decodeURIComponent(atob(raw)))
                    : JSON.parse(raw);
                return decoded as T;
            } catch {
                return raw as unknown as T;
            }
        }

        if (action === "remove") {
            localStorage.removeItem(storeKey);
            return true as unknown as T;
        }

        if (action === "clear") {
            localStorage.clear();
            return true as unknown as T;
        }

        return null as unknown as T;
    }

    async get<T = any>(key: string): Promise<T | null> {
        return this.request<T>("get", { key });
    }

    async set(key: string, value: any): Promise<boolean> {
        return this.request<boolean>("set", { key, value });
    }

    async remove(key: string): Promise<boolean> {
        return this.request<boolean>("remove", { key });
    }

    async clear(): Promise<boolean> {
        return this.request<boolean>("clear");
    }
}

export const storage = new GlobalStorage();
