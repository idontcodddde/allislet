import { createAllislet, defineConfig } from "allislet";

const sdk = createAllislet(defineConfig({
    id: "custom-sidebar-view",
    name: "Custom Sidebar View",
    version: "1.0.0",
    sidebar: { enabled: true },
    activeTabs: ["sidebar", "custom-status"],
}), {
    builtInUI: true,
});

sdk.addView({
    id: "custom-status",
    label: "Status",
    icon: "✓",
    order: 1,
    render({ container }) {
        const status = document.createElement("div");
        status.textContent = "Custom tab registered at runtime";
        container.append(status);
        return () => status.remove();
    },
});

await sdk.mount();
