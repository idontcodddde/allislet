import type { AllisletConfig } from "./types";

// Core Engine & Utilities
export { EventBus, eventBus } from "./core/EventBus";
export { pageExec, PageExecutor } from "./core/PageExecutor";
export { GlobalStorage, storage } from "./core/GlobalStorage";
export { AntiDetect, antiDetect } from "./core/AntiDetect";
export { stateRegistry } from "./core/StateRegistry";
export { windowManager } from "./core/WindowManager";
export { initNetworkEngine } from "./core/Engine";

// Context
export { AllisletProvider, useAllislet } from "./context/AllisletContext";

// WebSocket Core
export { WebSocketManager, wsManager } from "./core/WebSocketManager";
export { WebSocketSniffer, wsSniffer } from "./core/WebSocketSniffer";
export { SocketIoBridge, socketIoBridge } from "./core/SocketIoBridge";

// DOM Utilities
export { DOMObserver, DOMObserverManager } from "./dom/DOMObserver";
export {
    Teleport,
    teleport,
    type TeleportPosition,
    type TeleportProps,
} from "./dom/Teleport";

// Network Tools
export {
    BearerExtractor,
    BearerTokenExtractor,
} from "./network/BearerExtractor";
export { NetworkMock, NetworkMockManager } from "./network/NetworkMock";
export { patchFetch } from "./network/PatchFetch";
export { patchXHR } from "./network/PatchXHR";

// Automation & Macro
export {
    type MacroAction,
    MacroRecorder,
    type PlayOptions,
} from "./macro/MacroRecorder";

// Types & Helper
export type { AllisletConfig };

export function defineConfig(config: AllisletConfig): AllisletConfig {
    return config;
}
