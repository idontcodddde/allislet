import { defineConfig } from "allislet";

export default defineConfig({
    id: "my-custom-bookmarklet",
    name: "DevTools Suite",
    version: "1.0.0",
    theme: {
        mode: "dark",
        accentColor: "#74c7ec",
        defaultDockPosition: "center",
    },
    storage: {
        namespace: "my_app_v1",
        crossDomainHubUrl: "http://localhost:3000/public/storage.html",
        encryptLocalStorage: false,
    },
    features: {
        patchFetch: true,
        patchXHR: true,
        interceptSockets: true,
        autoExtractBearer: true,
    },
    activeTabs: [
        "network-logger",
        "websocket-manager",
        "js-console",
        "macro-studio",
        "storage-explorer",
        "dom-inspector",
        "sidebar",
    ],
    hotkeys: [
        { combo: "Alt+K", action: "ui:open-command-palette" },
    ],
    onMount({ eventBus, pageExec }) {
        console.log("[Allislet] Framework engine initialized!");
    },
    onCleanup() {
        console.log("[Allislet] Cleaned up runtime resources.");
    },
});
