export interface FetchPatchRules {
    onGet?: (url: string, init?: RequestInit) => void | Response | Promise<Response>;
    onPost?: (url: string, init?: RequestInit) => void | Response | Promise<Response>;
    onRequest?: (url: string, init?: RequestInit) => void | Response | Promise<Response>;
    onResponse?: (url: string, response: Response) => void;
}
export declare function patchFetch(rules?: FetchPatchRules): void;
export declare function unpatchFetch(): void;
