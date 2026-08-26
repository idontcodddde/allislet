# Allislet

Allislet is an experimental Preact wrapper designed specifically for building browser bookmarklets and shadow-injected overlay utilities. 

> **Current Project Status: Meme**
> 
> Allislet is currently in early pre-alpha development. It is unstable, incomplete, and not production-ready. Using it in any serious project is strongly discouraged until it reaches at least a stable alpha release.

---

## Features (Planned & In Development)

- Preact integration optimized for single-file bookmarklet bundles
- Encapsulated Shadow DOM layout management to prevent CSS leakage
- Cross-shadow-boundary DOM interaction and macro recording utilities
- Modular view and tab registration pattern for DevTools overlay suites

---

## Documentation

For full guides, API references, and architectural concepts, visit the primary documentation site:

**[Read the Allislet Documentation](https://docs-not-made-yet-itsmemestatusrememberlol.com)**

---

## Quick Example

```tsx
import { render } from "preact";
import { App } from "./App";

// Allislet mounts inside an isolated Shadow DOM root
const host = document.createElement("div");
host.id = "allislet-root";
document.body.appendChild(host);

const shadow = host.attachShadow({ mode: "open" });
const mountPoint = document.createElement("div");
shadow.appendChild(mountPoint);

render(<App/>, mountPoint);
