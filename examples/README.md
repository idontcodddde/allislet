# Allislet SDK example

`basic-sdk.ts` demonstrates importing and configuring Allislet without coupling
the consumer UI to Preact. It disables the built-in shell and supplies a plain
DOM renderer through `renderApp`.

`complete-integration.ts` demonstrates the full runtime surface: configured
network interception, mocks, bearer extraction, WebSocket monitoring, DOM
observation, macro recording, page execution, console capture, admin state,
service-worker registration, Socket.IO bridging, storage, windows, and
teardown.

`dynamic-import.html` demonstrates browser usage with top-level
`await import("https://.../standalone.js")`. Replace the example CDN URL with
the URL where `dist/standalone.js` is hosted.

For a package-based dynamic import, use `dynamic-import.ts`:

```ts
const { createAllislet, defineConfig } = await import("allislet/standalone");
const sdk = createAllislet(defineConfig({
  id: "dynamic-tool",
  name: "Dynamic Tool",
  version: "1.0.0",
}), { builtInUI: false });
await sdk.mount();
```

`unpkg-complete.html` is a browser-ready complete integration using:

```ts
const { createAllislet } = await import(
  "https://unpkg.com/allislet@1.0.0/dist/standalone.js"
);
```

It demonstrates configuration, the built-in collapsible sidebar, all built-in
runtime services, network and WebSocket interception, storage, DOM automation,
macro recording, page execution, admin/service-worker/socket bridges, exports,
diagnostics, and teardown.

`custom-sidebar-view.tsx` demonstrates adding a typed runtime view with
`sdk.addView(...)`. You can also provide `views` in the configuration object.

```ts
import { createAllislet, defineConfig } from "allislet";

const sdk = createAllislet(defineConfig({
  id: "my-tool",
  name: "My Tool",
  version: "1.0.0",
}), {
  builtInUI: false,
  renderApp: ({ renderTarget }) => {
    const button = document.createElement("button");
    button.textContent = "Hello";
    renderTarget.append(button);
    return () => button.remove();
  },
});

await sdk.mount();
```

Use `builtInUI: true` (the default) to render the existing Preact shell, or
provide a renderer for React, Vue, Svelte, plain DOM, or server-driven UI.
