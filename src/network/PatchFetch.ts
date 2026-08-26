import { NetworkMock } from "./NetworkMock";
import { BearerExtractor } from "./BearerExtractor";
import { eventBus } from "../core/EventBus";

export interface FetchPatchRules {
    onGet?: (
        url: string,
        init?: RequestInit,
    ) => void | Response | Promise<Response>;
    onPost?: (
        url: string,
        init?: RequestInit,
    ) => void | Response | Promise<Response>;
    onRequest?: (
        url: string,
        init?: RequestInit,
    ) => void | Response | Promise<Response>;
    onResponse?: (url: string, response: Response) => void;
}

let isFetchPatched = false;

export function patchFetch(rules: FetchPatchRules = {}): void {
    if (isFetchPatched) return;
    const originalFetch = window.fetch;

    const patchedFetch = async function (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> {
        const url = typeof input === "string"
            ? input
            : input instanceof URL
            ? input.toString()
            : input.url;
        const method = (init?.method || "GET").toUpperCase();

        if (init?.headers) {
            const headersObj = new Headers(init.headers);
            const auth = headersObj.get("Authorization") ||
                headersObj.get("authorization");
            BearerExtractor.extractFromHeader(auth);
        }

        const mock = NetworkMock.findMatch(url);
        if (mock) {
            if (mock.type === "drop") {
                return new Promise<Response>(() => {}); // Never resolves
            }
            if (mock.type === "delay" && mock.delayMs) {
                await new Promise((res) => setTimeout(res, mock.delayMs));
            }
            if (mock.type === "silent200") {
                const body = typeof mock.payload === "string"
                    ? mock.payload
                    : JSON.stringify(mock.payload);
                return new Response(body, {
                    status: 200,
                    statusText: "OK",
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        if (rules.onRequest) {
            const res = await rules.onRequest(url, init);
            if (res instanceof Response) return res;
        }
        if (method === "GET" && rules.onGet) {
            const res = await rules.onGet(url, init);
            if (res instanceof Response) return res;
        }
        if (method === "POST" && rules.onPost) {
            const res = await rules.onPost(url, init);
            if (res instanceof Response) return res;
        }

        eventBus.emit("network:fetch:request", { url, method, init });
        const response = await originalFetch.apply(window, [input, init]);

        if (rules.onResponse) {
            rules.onResponse(url, response.clone());
        }

        eventBus.emit("network:fetch:response", {
            url,
            status: response.status,
        });
        return response;
    };

    Object.assign(patchedFetch, originalFetch);
    window.fetch = patchedFetch as typeof fetch;

    isFetchPatched = true;
}
