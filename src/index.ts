import type { AllisletConfig } from "./types";

// Core Engine & Utilities
export { EventBus, eventBus } from "./core/EventBus";
export { pageExec, PageExecutor } from "./core/PageExecutor";
export { GlobalStorage, storage } from "./core/GlobalStorage";
export { AntiDetect, antiDetect } from "./core/AntiDetect";
export { stateRegistry } from "./core/StateRegistry";
export { WindowManager, windowManager } from "./core/WindowManager";
export { DragController, type DragOptions } from "./core/DragController";
export { Modal, ModalContainer } from "./ui/Modal";
export {
    type HotkeyConfig,
    HotkeyManager,
    hotkeyManager,
} from "./core/HotkeyManager";
export { initNetworkEngine } from "./core/Engine";

// Context & Theme
export { AllisletProvider, useAllislet } from "./context/AllisletContext";
export { Theme } from "./theme/Theme";

// WebSocket Core
export { WebSocketManager, wsManager } from "./core/WebSocketManager";
export { WebSocketSniffer, wsSniffer } from "./core/WebSocketSniffer";
export { SocketIoBridge, socketIoBridge } from "./core/SocketIoBridge";

// DOM Utilities & Security
export { DOMObserver, DOMObserverManager } from "./dom/DOMObserver";
export {
    Teleport,
    teleport,
    type TeleportPosition,
    type TeleportProps,
} from "./dom/Teleport";
export { type AbsoluteBounds, DOMUtils } from "./utils/DOMutils";
export { Highlighter } from "./utils/Highlighter";
export { ElementPicker } from "./utils/ElementPicker";
export { DOMFinder } from "./utils/DOMFinder";
export { FormAutofill } from "./utils/FormAutofill";
export { Sanitizer } from "./utils/Sanitizer";

// Window Config Export
export type { WindowConfig, WindowView } from "./windows/types";

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
    type MacroActionType,
    MacroRecorder,
    type PlayOptions,
} from "./macro/MacroRecorder";

// Command Registry & Shortcuts
export {
    type Command,
    CommandRegistry,
    commandRegistry,
} from "./core/CommandRegistry";

// Toast System & Error Boundary
export { Toast, ToastContainer, type ToastOptions } from "./ui/Toast";
export { ErrorBoundary } from "./components/ErrorBoundary";

// Types & Helper
export type { AllisletConfig };

export function defineConfig(config: AllisletConfig): AllisletConfig {
    return config;
}
