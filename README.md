# Allislet

Allislet is a high-performance browser SDK for building shadow-isolated bookmarklets and injected applications using Preact, TypeScript, and Bun. It is designed for host-safe overlays, DOM automation, network interception, remote tooling, and app-shell infrastructure that can run inside arbitrary websites without destabilizing the page.

## Project status

Allislet is currently released as v1.0.0.

This release is intended as the first public stable SDK milestone for the project. It is meant to be a reusable foundation for building shadow-isolated browser tools, injected overlays, and app-shell integrations while remaining open to future iteration.

## What it is

Allislet is not just a launcher or a tiny bookmarklet helper. It is a runtime framework for building browser-side tool surfaces that can:

- mount inside a closed Shadow DOM for isolation
- render a Preact app shell with provider-driven services
- execute script logic in controlled page contexts
- intercept fetch, XHR, and socket traffic
- observe and automate DOM interactions
- manage floating windows, panels, modals, and docking layouts
- coordinate live chat, admin, and remote execution workflows
- load external libraries and runtime data through config-driven bootstrapping

## Why it exists

The project is built around one core idea: empower browser overlays and injected tools without polluting or breaking the host page. Instead of rewriting the host environment, Allislet creates a safe runtime boundary where the SDK can own its own layout, storage, events, and execution model.

This makes it useful for:

- bookmarklet tooling
- injected browser utilities
- debugging and inspection overlays
- automation surfaces
- internal admin or operator dashboards
- multi-user chat and runtime control panels

## Architecture at a glance

Allislet is organized into layered runtime stages:

- Core foundations: storage, lifecycle, events, shadow mount, config definitions
- Execution services: page execution, anti-detect logic, CSP-safe injection, socket tracking
- DOM automation: observers, form automation, element picking, highlighting, macro recording
- UI shell: docking, windows, modals, command registry, toasts, error boundaries
- Data and browser utilities: URL binding, exports, capture tools, file access, worker execution, indexing, performance tracing
- Built-in tabs: chat, DM, admin, and remote execution surfaces

The runtime begins in src/main.tsx, where the host bootstrap mounts the app into a Shadow Root and renders the top-level Preact shell under an Allislet provider context.

## Main SDK concepts

### Shadow-isolated mount

The app mounts into a closed Shadow Root to keep styles, events, and layout behavior isolated from the underlying host page.

### Preact provider context

AllisletProvider exposes shared runtime services through a single context object via useAllislet(). This makes it simple for child views and widgets to access shared infrastructure without re-instantiating services constantly.

### Config-first bootstrapping

Runtime behavior is driven by a top-level config object in allislet.config.ts, which controls:

- app identity and metadata
- storage namespace and cross-domain hub behavior
- runtime feature toggles
- library ingestion
- theme configuration
- active tabs and hotkeys
- lifecycle hooks

### Data fetching via useData

The SDK includes a useData helper for fetching JSON resources from a predictable data path. In local development it defaults to localhost:5173/data, while in production it resolves from the current origin.

## Quick start

Install dependencies:

```bash
bun install
```

Start the development environment:

```bash
bun run dev
```

Build the production bundle:

```bash
bun run build
```

## Minimal configuration

```ts
import { defineConfig } from "allislet";

export default defineConfig({
  id: "my-sdk-app",
  name: "Dev Tools Suite",
  version: "v1.0.0",
  theme: {
    mode: "dark",
    accentColor: "#74c7ec",
    defaultDockPosition: "right",
  },
  storage: {
    namespace: "my_sdk_v1",
    crossDomainHubUrl: "http://localhost:5173/public/storage.html",
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
    "macro-studio",
    "settings",
  ],
  hotkeys: [
    { combo: "Alt+K", action: "ui:do-thing" },
  ],
  onMount({ eventBus, pageExec }) {
    console.log("Allislet initialized");
  },
  onCleanup() {
    console.log("Allislet cleaned up");
  },
});
```

## Core feature highlights

### Network and socket interception

- fetch and XHR patching
- websocket tracking and lifecycle control
- socket event bridging
- network mocking for latency, drop, and silent success patterns
- bearer extraction and runtime auth inspection

### DOM automation

- MutationObserver-based DOM observation
- text and XPath-based DOM finding
- element selecting and highlighting
- form autofill and interaction recording
- macro replay for repeated workflows

### Overlay and shell controls

- floating windows and sub-panels
- docked layout modes
- modal overlays and toast notifications
- command palette and hotkey-driven navigation
- theme engine with dark and light support

### Collaboration and admin tooling

- realtime chat and DM system
- username persistence
- public room and direct-message flows
- admin gating with runtime permission checks
- remote execution across connected clients

## Documentation map

The project documentation is organized into the GitHub wiki pages:

- Home
- Architecture and Bootstrap
- Feature Guide
- Configuration Reference
- Network and Socket Interception
- DOM and Automation
- UI and Overlay System
- Chat and Admin Console

These pages provide the deeper design and usage details for the runtime, boot pattern, and feature system.

## Project structure

```text
allislet/
  src/
    main.tsx
    App.tsx
    context/
    core/
    utils/
    views/
    windows/
  wiki/
  allislet.config.ts
  package.json
  vite.config.ts
  tsconfig.json
```

## Development commands

```bash
bun install
bun run dev
bun run build
```

## License

This project is distributed under the repository license file included in the source tree.

## Summary

Allislet is a browser-first SDK for building isolated, capable, and configurable runtime overlays. It combines Preact rendering, controlled browser execution, network inspection, DOM automation, and admin-style tooling into a single app shell that stays safely separated from the host page.

If you want a browser overlay framework with a strong runtime model and a clean bootstrap story, Allislet is designed for that purpose.
