type UrlCallback = (matches: RegExpMatchArray | null, url: URL) => void;
type ParamCallback = (value: string, url: URL) => void;

export class PageRouter {
    private static instance: PageRouter;
    private urlListeners: Array<{ pattern: RegExp; callback: UrlCallback }> =
        [];
    private paramListeners: Array<
        { paramKey: string; callback: ParamCallback }
    > = [];

    private constructor() {
        if (typeof window !== "undefined") {
            window.addEventListener("popstate", this.check);
            this.patchHistory();
            setTimeout(() => this.check(), 0);
        }
    }

    public static getInstance(): PageRouter {
        if (!PageRouter.instance) {
            PageRouter.instance = new PageRouter();
        }
        return PageRouter.instance;
    }

    public static onUrl(
        regexPattern: RegExp | string,
        callback: UrlCallback,
    ): () => void {
        const router = PageRouter.getInstance();
        const pattern = typeof regexPattern === "string"
            ? new RegExp(regexPattern)
            : regexPattern;
        const listener = { pattern, callback };
        router.urlListeners.push(listener);

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            const match = url.href.match(pattern) ||
                url.pathname.match(pattern);
            if (match) callback(match, url);
        }

        return () => {
            router.urlListeners = router.urlListeners.filter((l) =>
                l !== listener
            );
        };
    }

    public static onParam(
        paramKey: string,
        callback: ParamCallback,
    ): () => void {
        const router = PageRouter.getInstance();
        const listener = { paramKey, callback };
        router.paramListeners.push(listener);

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            const val = url.searchParams.get(paramKey);
            if (val !== null) callback(val, url);
        }

        return () => {
            router.paramListeners = router.paramListeners.filter((l) =>
                l !== listener
            );
        };
    }

    public check = (): void => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);

        for (const { pattern, callback } of this.urlListeners) {
            const match = url.href.match(pattern) ||
                url.pathname.match(pattern);
            if (match) callback(match, url);
        }

        for (const { paramKey, callback } of this.paramListeners) {
            const val = url.searchParams.get(paramKey);
            if (val !== null) callback(val, url);
        }
    };

    private patchHistory(): void {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.check();
        };

        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.check();
        };
    }
}
