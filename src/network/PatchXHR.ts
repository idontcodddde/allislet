import { NetworkMock } from "./NetworkMock";
import { BearerExtractor } from "./BearerExtractor";
import { eventBus } from "../core/EventBus";

export interface XHRPatchRules {
    onRequest?: (method: string, url: string, body?: any) => void;
    onResponse?: (url: string, xhr: XMLHttpRequest) => void;
}

let isXHRPatched = false;

export function patchXHR(rules: XHRPatchRules = {}): void {
    if (isXHRPatched) return;
    const NativeXHR = window.XMLHttpRequest;

    function InterceptedXHR(this: XMLHttpRequest) {
        const xhr = new NativeXHR();
        let _url = "";
        let _method = "GET";

        const originalOpen = xhr.open.bind(xhr);
        xhr.open = function (
            method: string,
            url: string | URL,
            ...args: any[]
        ) {
            _method = method.toUpperCase();
            _url = url.toString();
            return (originalOpen as any)(method, url, ...args);
        };

        const originalSetHeader = xhr.setRequestHeader.bind(xhr);
        xhr.setRequestHeader = function (header: string, value: string) {
            if (header.toLowerCase() === "authorization") {
                BearerExtractor.extractFromHeader(value);
            }
            return originalSetHeader(header, value);
        };

        const originalSend = xhr.send.bind(xhr);
        xhr.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
            const mock = NetworkMock.findMatch(_url);

            if (mock) {
                if (mock.type === "drop") return; // Silently drop
                if (mock.type === "silent200") {
                    setTimeout(() => {
                        Object.defineProperty(xhr, "status", {
                            value: 200,
                            writable: false,
                        });
                        Object.defineProperty(xhr, "readyState", {
                            value: 4,
                            writable: false,
                        });
                        Object.defineProperty(xhr, "responseText", {
                            value: typeof mock.payload === "string"
                                ? mock.payload
                                : JSON.stringify(mock.payload),
                            writable: false,
                        });
                        xhr.dispatchEvent(new Event("readystatechange"));
                        xhr.dispatchEvent(new Event("load"));
                    }, mock.delayMs || 0);
                    return;
                }
                if (mock.type === "delay" && mock.delayMs) {
                    setTimeout(() => {
                        rules.onRequest?.(_method, _url, body);
                        eventBus.emit("network:xhr:request", {
                            url: _url,
                            method: _method,
                        });
                        originalSend(body);
                    }, mock.delayMs);
                    return;
                }
            }

            rules.onRequest?.(_method, _url, body);
            eventBus.emit("network:xhr:request", {
                url: _url,
                method: _method,
            });

            xhr.addEventListener("load", () => {
                rules.onResponse?.(_url, xhr);
                eventBus.emit("network:xhr:response", {
                    url: _url,
                    status: xhr.status,
                });
            });

            return originalSend(body);
        };

        return xhr;
    }

    InterceptedXHR.prototype = NativeXHR.prototype;
    Object.assign(InterceptedXHR, NativeXHR);

    window.XMLHttpRequest = InterceptedXHR as any;
    isXHRPatched = true;
}
