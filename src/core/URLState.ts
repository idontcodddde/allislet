export class URLState<T extends string | number | boolean> {
    private key: string;
    private defaultValue: T;
    private listeners: Set<(val: T) => void> = new Set();

    constructor(key: string, defaultValue: T) {
        this.key = key;
        this.defaultValue = defaultValue;
        if (typeof window !== "undefined") {
            window.addEventListener("popstate", this.handlePopState);
        }
    }

    public static bind<T extends string | number | boolean>(
        key: string,
        defaultValue: T,
    ): URLState<T> {
        return new URLState<T>(key, defaultValue);
    }

    public get(): T {
        if (typeof window === "undefined") return this.defaultValue;
        const urlParams = new URLSearchParams(window.location.search);
        const val = urlParams.get(this.key);
        if (val === null) return this.defaultValue;

        if (typeof this.defaultValue === "number") {
            const num = Number(val);
            return (isNaN(num) ? this.defaultValue : num) as T;
        }
        if (typeof this.defaultValue === "boolean") {
            return (val === "true") as T;
        }
        return val as T;
    }

    public set(newValue: T): void {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);

        if (
            newValue === this.defaultValue || newValue === undefined ||
            newValue === null
        ) {
            url.searchParams.delete(this.key);
        } else {
            url.searchParams.set(this.key, String(newValue));
        }

        window.history.replaceState(null, "", url.toString());
        this.notify();
    }

    public subscribe(cb: (val: T) => void): () => void {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    private notify(): void {
        const val = this.get();
        this.listeners.forEach((cb) => cb(val));
    }

    private handlePopState = (): void => {
        this.notify();
    };

    public destroy(): void {
        if (typeof window !== "undefined") {
            window.removeEventListener("popstate", this.handlePopState);
        }
        this.listeners.clear();
    }
}
