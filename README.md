# Allislet

Allislet is an experimental Preact wrapper designed specifically for building browser bookmarklets and shadow-injected overlay suites. It provides built-in Shadow DOM mounting, layout shell primitives, and state providers to build isolated, multi-view tools inside host web pages.

> **Current Project Status: Meme**
> 
> Allislet is currently in early pre-alpha development. It is unstable, incomplete, and not production-ready. Using it in any serious project is strongly discouraged until it reaches at least a stable alpha release.

---

## Features

- **Isolated Mount Execution**: Auto-injects into a clean, unstyled Shadow DOM root to prevent host page CSS pollution.
- **Integrated App Shell**: Pre-built collapsible sidebar and view container layouts styled for dark-mode overlays.
- **Context State Engine**: Built-in `AllisletProvider` for global tab routing, macro recording instances, and view collapses.
- **Cross-Boundary Event Capture**: Utilities designed to handle DOM events across light and Shadow DOM roots.

---

## Documentation

For full guides, API references, and architectural concepts, visit the primary documentation site:

**[Read the Allislet Documentation](https://your-docusaurus-site.com)**

---

## Complete Example

This example demonstrates setting up the Shadow DOM mount, wrapping the application inside the `AllisletProvider`, and constructing a full UI with the `AppShell` and custom views.

```tsx
import { render } from "preact";
import { 
  AllisletProvider, 
  AppShell, 
  useAllislet, 
  MacroView, 
  SettingsView 
} from "allislet";

// 1. Define custom views or use pre-built components
const views = [
  MacroView,
  SettingsView,
];

// 2. Custom App implementation utilizing the state hook
function App() {
  const { activeTab, setActiveTab, isCollapsed, setIsCollapsed } = useAllislet();

  return (
    <AppShell activeTab="{activeTab}" isCollapsed="{isCollapsed}" onTabChange="{setActiveTab}" onToggleCollapse="{()" title="DevTools Suite" views="{views}"> setIsCollapsed((prev) => !prev)}
    />
  );
}

// 3. Mount into an isolated Shadow DOM container
export function initBookmarklet() {
  const HOST_ID = "my-custom-bookmarklet";
  
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  render(
    <AllisletProvider>
      <App/>
    </AllisletProvider>,
    mountPoint
  );
}

// Run the bookmarklet
initBookmarklet();
