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

storage.configure(config.storage);

let hostElement: HTMLElement | null = null;

async function bootstrapLifecycle(): Promise<void> {
  const containerId = config.id || "allislet-root";
  if (document.getElementById(containerId)) return;

  try {
    await storage.init();
    await stateRegistry.hydrateAll();

    hostElement = document.createElement("div");
    hostElement.id = containerId;
    Object.assign(hostElement.style, getPositionStyles(overlayPositionSignal.value));

    overlayPositionSignal.subscribe((newPos) => {
      if (hostElement) {
        Object.assign(hostElement.style, getPositionStyles(newPos));
        windowManager.resetPosition();
      }
    });

    document.body.appendChild(hostElement);
    const shadowRoot = hostElement.attachShadow({ mode: "closed" });

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      :host { all: initial; font-family: sans-serif; }
      *, *::before, *::after { box-sizing: border-box; }
    `;
    shadowRoot.appendChild(styleEl);

    const renderTarget = document.createElement("div");
    renderTarget.style.pointerEvents = "auto";
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