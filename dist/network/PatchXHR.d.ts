export interface XHRPatchRules {
    onRequest?: (method: string, url: string, body?: unknown) => void;
    onResponse?: (url: string, xhr: XMLHttpRequest) => void;
}
export declare function patchXHR(rules?: XHRPatchRules): void;
export declare function unpatchXHR(): void;
