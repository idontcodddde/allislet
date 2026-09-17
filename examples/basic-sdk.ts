import {
    createAllislet,
    type AllisletRuntimeContext,
    defineConfig,
} from "allislet";

const config = defineConfig({
    id: "allislet-example",
    name: "Allislet Example",
    version: "1.0.0",
    theme: {
        mode: "dark",
        accentColor: "#74c7ec",
        defaultDockPosition: "right",
    },
    features: {
        patchFetch: true,
        patchXHR: true,
        interceptSockets: true,
        autoExtractBearer: true,
    },
    activeTabs: ["js-console", "settings", "macro-studio"],
});

const sdk = createAllislet(config, {
    // Set builtInUI to false when integrating Allislet into another UI framework.
    builtInUI: false,
    renderApp: ({ renderTarget, eventBus }: AllisletRuntimeContext) => {
        const panel = renderTarget.ownerDocument.createElement("section");
        panel.dataset.allisletExample = "true";
        panel.innerHTML = `
            <h2>Custom Allislet integration</h2>
            <p>This UI is plain DOM and does not import Preact.</p>
            <button type="button">Run a request</button>
        `;

        panel.querySelector("button")?.addEventListener("click", async () => {
            const response = await fetch("/api/example");
            eventBus.emit("example:response", { status: response.status });
        });
        renderTarget.appendChild(panel);

        return () => panel.remove();
    },
});

await sdk.mount();

// The same instance exposes storage, windows, and lifecycle controls.
await sdk.getStorage().set("example:ready", true);
