import {
    AdminStore,
    BearerExtractor,
    ConsoleRedirector,
    DOMObserver,
    MacroRecorder,
    NetworkMock,
    ServiceWorkerRegistrar,
    SocketIoBridge,
    createAllislet,
    defineConfig,
    eventBus,
    pageExec,
    wsManager,
} from "allislet";
const config = defineConfig({
    id: "allislet-complete-example",
    name: "Allislet Complete Integration",
    version: "1.0.0",
    dataUrl: "/tool-data",
    theme: {
        mode: "dark",
        accentColor: "#74c7ec",
        defaultDockPosition: "right",
    },
    features: {
        patchFetch: {
            onRequest: (url, init) => {
                eventBus.emit("example:fetch", {
                    url,
                    method: init?.method || "GET",
                });
            },
            onResponse: (url, response) => {
                eventBus.emit("example:response", {
                    url,
                    status: response.status,
                });
            },
        },
        patchXHR: {
            onRequest: (method, url) => {
                eventBus.emit("example:xhr", { method, url });
            },
        },
        interceptSockets: true,
        autoExtractBearer: true,
    },
    activeTabs: [
        "js-console",
        "network-logger",
        "websocket-manager",
        "macro-studio",
        "storage-explorer",
        "dom-inspector",
        "chat-view",
        "admin-view",
        "settings",
    ],
    onMount({ eventBus: runtimeEvents }) {
        runtimeEvents.on("network:fetch:response", (payload: unknown) => {
            console.debug("Fetch response:", payload);
        });
    },
});

const sdk = createAllislet(config);
await sdk.mount();

const storage = sdk.getStorage();
await storage.set("example:mounted", true);

// Network mocking and bearer inspection.
NetworkMock.silent200("/api/health", { ok: true });
const observedBearerToken = BearerExtractor.get();
if (observedBearerToken) {
    console.debug("Bearer token observed:", observedBearerToken.slice(0, 8));
}

// WebSocket inspection and frame injection.
const stopSocketLogging = wsManager.listen("ws:incoming", (frame) => {
    console.debug("Incoming socket frame:", frame.url, frame.data);
});
wsManager.lockClosed(/analytics/);

// DOM observation and macro recording.
const stopDomObserver = DOMObserver.onAttach("[data-example]", (element) => {
    element.setAttribute("data-allislet-seen", "true");
});
const recorder = new MacroRecorder();
recorder.start();

// Host-page execution and diagnostics.
await pageExec.runInMainWorld("window.dispatchEvent(new Event('allislet-ready'))");
ConsoleRedirector.capture();

// Optional admin, service-worker, and Socket.IO capabilities.
AdminStore.makeAdmin();
const serviceWorker = new ServiceWorkerRegistrar({ scriptUrl: "/example-sw.js" });
if ("serviceWorker" in navigator) {
    await serviceWorker.register();
}
const socketIo = new SocketIoBridge();
void socketIo;

// This example creates a managed SDK window using an existing Preact view.
sdk.openWindow("integration-status", {
    title: "Integration status",
    width: 360,
    height: 220,
    component: "Allislet services are active.",
});

// Call these during application teardown.
export function disposeExample(): void {
    recorder.stop();
    stopDomObserver();
    stopSocketLogging();
    ConsoleRedirector.release();
    AdminStore.revokeAdmin();
    sdk.destroy();
}
