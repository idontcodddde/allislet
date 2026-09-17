import { stateRegistry } from "./StateRegistry";
import { OverlayPosition } from "../utils/position";
import type { AllisletConfig } from "../types/config";

export const userThemeMode = stateRegistry.register<string>(
    "user_theme_mode",
    "dark",
);

export const activeTabSignal = stateRegistry.register<string>(
    "active_tab",
    "executor",
);

export const overlayPositionSignal = stateRegistry.register<OverlayPosition>(
    "overlay_position",
    "center",
);

export function configureSignals(config: AllisletConfig): void {
    if (config.theme?.mode) userThemeMode.value = config.theme.mode;
    if (config.activeTabs?.[0]) activeTabSignal.value = config.activeTabs[0];
    if (config.theme?.defaultDockPosition) {
        overlayPositionSignal.value = config.theme.defaultDockPosition as OverlayPosition;
    }
}

// Chat Signals
export const chatActiveTabSignal = stateRegistry.register<"global" | "room" | "dm">(
    "chat_active_tab",
    "global"
);

export const chatActiveTargetSignal = stateRegistry.register<string>(
    "chat_active_target",
    "global"
);

export const chatRoomsSignal = stateRegistry.register<string[]>(
    "chat_rooms",
    ["global"]
);

export const chatDmsSignal = stateRegistry.register<string[]>(
    "chat_dms",
    []
);