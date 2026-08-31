import config from "@config";
import { stateRegistry } from "./StateRegistry";
import { OverlayPosition } from "../utils/position";

export const userThemeMode = stateRegistry.register<string>(
    "user_theme_mode",
    config.theme?.mode || "dark",
);

export const activeTabSignal = stateRegistry.register<string>(
    "active_tab",
    config.activeTabs?.[0] || "executor",
);

export const overlayPositionSignal = stateRegistry.register<OverlayPosition>(
    "overlay_position",
    (config.theme?.defaultDockPosition as OverlayPosition) || "center",
);

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