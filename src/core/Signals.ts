import config from "@config";
import { stateRegistry } from "./StateRegistry";
import { OverlayPosition } from "../utils/position";

export const userThemeMode = stateRegistry.register<string>(
    "user_theme_mode",
    config.theme?.mode || "dark",
);

export const activeTabSignal = stateRegistry.register<string>(
    "active_tab",
    config.activeTabs?.[0] || "network-logger",
);

export const overlayPositionSignal = stateRegistry.register<OverlayPosition>(
    "overlay_position",
    (config.theme?.defaultDockPosition as OverlayPosition) || "center",
);
