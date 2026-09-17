type UrlCallback = (matches: RegExpMatchArray | null, url: URL) => void;
type ParamCallback = (value: string, url: URL) => void;
export declare class PageRouter {
    private static instance;
    private urlListeners;
    private paramListeners;
    private constructor();
    static getInstance(): PageRouter;
    static onUrl(regexPattern: RegExp | string, callback: UrlCallback): () => void;
    static onParam(paramKey: string, callback: ParamCallback): () => void;
    check: () => void;
    private patchHistory;
}
export {};
