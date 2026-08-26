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

## Configuration

You can configure build options and shadow root parameters through an optional configuration file:

```typescript
// allislet.config.ts
import { defineConfig } from 'allislet';

export default defineConfig({
  id: 'my-custom-bookmarklet',
  name: 'DevTools Suite',
  version: '1.0.0',
  theme: {
    mode: 'dark',
    accentColor: '#74c7ec',
    defaultDockPosition: 'right',
  },
  storage: {
    namespace: 'my_app_v1',
    crossDomainHubUrl: 'https://my-domain.com/storage-hub.html',
    encryptLocalStorage: true,
  },
  features: {
    patchFetch: true,
    patchXHR: true,
    interceptSockets: true,
    autoExtractBearer: true,
  },
  activeTabs: [
    'network-logger',
    'websocket-manager',
    'js-console',
    'macro-studio',
    'storage-explorer',
    'dom-inspector',
    'settings',
    'analytics'
  ],
  hotkeys: [{
      combo: 'Alt+Shift+Z',
      action: 'toggle-ui'
    },
    {
      combo: 'Ctrl+K',
      action: 'open-command-palette'
    },
  ],
  onMount({
    eventBus,
    pageExec
  }) {
    console.log('[Allislet] Framework engine initialized!');
  },
  onCleanup() {
    console.log('[Allislet] Cleaned up runtime resources.');
  },
});
```

# Documentation

For full guides, API references, and architectural concepts, visit the primary documentation site:

[Read the Allislet documentation](https://no-doc-site-its-meme-status-remember)

# Example

```typescript
import { render } from "preact";
import { 
  AllisletProvider, 
  AppShell, 
  useAllislet, 
  MacroView, 
  SettingsView 
} from "allislet";

// First, define custom views or use pre-built components
const views = [
  MacroView,
  SettingsView,
];

// Second, implement custom App utilizing the state hook
function App() {
  const { activeTab, setActiveTab, isCollapsed, setIsCollapsed } = useAllislet();

  return (
    <AppShell activeTab="{activeTab}" isCollapsed="{isCollapsed}" onTabChange="{setActiveTab}" onToggleCollapse="{()" title="DevTools Suite" views="{views}"> setIsCollapsed((prev) => !prev)}
    />
  );
}

// Third, mount into an isolated Shadow DOM container
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
```

# License

MIT (check License file)