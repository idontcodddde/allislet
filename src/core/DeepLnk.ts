export type ActionHandler = (params: Record<string, string>) => void;

export class DeepLnk {
    private static handlers: Map<string, ActionHandler> = new Map();
    private static initialized = false;

    public static create(
        action: string,
        params: Record<string, any> = {},
    ): string {
        const queryParts = Object.entries(params)
            .map(([k, v]) =>
                `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
            )
            .join("&");
        const hashPayload = queryParts
            ? `action=${encodeURIComponent(action)}&${queryParts}`
            : `action=${encodeURIComponent(action)}`;

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.hash = hashPayload;
            return url.toString();
        }
        return `#${hashPayload}`;
    }

    public static register(action: string, handler: ActionHandler): () => void {
        DeepLnk.handlers.set(action, handler);
        DeepLnk.init();
        return () => {
            DeepLnk.handlers.delete(action);
        };
    }

    public static init(): void {
        if (DeepLnk.initialized || typeof window === "undefined") return;
        DeepLnk.initialized = true;

        window.addEventListener("hashchange", DeepLnk.executeFromHash);
        if (window.location.hash) {
            DeepLnk.executeFromHash();
        }
    }

    public static executeFromHash = (): void => {
        const hash = window.location.hash.replace(/^#/, "");
        if (!hash) return;

        const params = new URLSearchParams(hash);
        const action = params.get("action");
        if (!action) return;

        const handler = DeepLnk.handlers.get(action);
        if (handler) {
            const paramObj: Record<string, string> = {};
            params.forEach((value, key) => {
                if (key !== "action") paramObj[key] = value;
            });
            handler(paramObj);
        }
    };
}
