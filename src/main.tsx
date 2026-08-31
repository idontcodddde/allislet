import { render } from "preact";
import { AppShell } from "./components/AppShell";
import config from "@config";
import { eventBus } from "./core/EventBus";
import { antiDetect } from "./core/AntiDetect";
import { pageExec } from "./core/PageExecutor";
import { storage } from "./core/GlobalStorage";
import { stateRegistry } from "./core/StateRegistry";
import { windowManager } from "./core/WindowManager";
import { AllisletProvider } from "./context/AllisletContext";
import { overlayPositionSignal } from "./core/Signals";
import { getPositionStyles } from "./utils/position";
import { ModalContainer } from "./ui/Modal";

storage.configure(config.storage);

let hostElement: HTMLElement | null = null;

/**
 * Applies positional CSS rules to the host element without breaking position switches or flex layout.
 */
function updateHostPosition(element: HTMLElement, position: any): void {
  // Clear directional and flex properties so changing positions cleans up completely
  element.style.top = "";
  element.style.bottom = "";
  element.style.left = "";
  element.style.right = "";
  element.style.transform = "";
  element.style.display = "";
  element.style.justifyContent = "";
  element.style.alignItems = "";

  Object.assign(element.style, {
    position: "fixed",
    zIndex: "2147483647",
    pointerEvents: "none",
    ...getPositionStyles(position),
  });
}

async function bootstrapLifecycle(): Promise<void> {
  const containerId = config.id || "allislet-root";
  if (document.getElementById(containerId)) return;

  try {
    await storage.init();
    await stateRegistry.hydrateAll();

    hostElement = document.createElement("div");
    hostElement.id = containerId;
    updateHostPosition(hostElement, overlayPositionSignal.value);

    // Dynamic position updates via signal
    overlayPositionSignal.subscribe((newPos) => {
      if (hostElement) {
        updateHostPosition(hostElement, newPos);
        windowManager.resetPosition();
      }
    });

    document.body.appendChild(hostElement);

    const shadowRoot = hostElement.attachShadow({ mode: "open" });

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      :host {
        pointer-events: none !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }

      #allislet-render-target {
        display: contents !important;
      }

      [data-window-container] {
        pointer-events: auto !important;
      }
    `;
    shadowRoot.appendChild(styleEl);

    const renderTarget = document.createElement("div");
    renderTarget.id = "allislet-render-target";
    shadowRoot.appendChild(renderTarget);

    windowManager.attach(hostElement, shadowRoot);

    render(
      <AllisletProvider
        config={config}
        eventBus={eventBus}
        pageExec={pageExec}
        storage={storage}
        antiDetect={antiDetect}
      >
        <ModalContainer />
        <AppShell />
      </AllisletProvider>,
      renderTarget
    );

    if (typeof config.onMount === "function") {
      config.onMount({ eventBus, pageExec, storage, antiDetect });
    }
  } catch (error) {
    console.error("[Allislet Lifecycle] Bootstrap error:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapLifecycle, { once: true });
} else {
  bootstrapLifecycle();
}