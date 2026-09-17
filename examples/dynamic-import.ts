const { createAllislet } = await import(
    "allislet/standalone"
);

const sdk = createAllislet({
    id: "dynamic-import-sdk",
    name: "Dynamic Import SDK",
    version: "1.0.0",
    features: {
        patchFetch: true,
        patchXHR: true,
        interceptSockets: true,
        autoExtractBearer: true,
    },
}, {
    builtInUI: false,
    renderApp({ renderTarget }) {
        const status = document.createElement("div");
        status.textContent = "Allislet loaded through await import()";
        renderTarget.append(status);
        return () => status.remove();
    },
});

await sdk.mount();

export function destroyDynamicImportExample(): void {
    sdk.destroy();
}
