import type { ThemeConfig } from "./theme";
import type { StorageConfig } from "./storage";
import type { FeaturesConfig, HotkeyRule } from "./features";
import type { AvailableTab } from "./tabs";
import type { OnMountContext } from "./lifecycle";
import type { ExternalLibrary } from "./libs";
import type { ViewDefinition } from "../views";

export interface SidebarConfig {
    enabled?: boolean;
    initiallyCollapsed?: boolean;
}

export interface AllisletConfig {
    id: string;
    name: string;
    version: string;
    dataUrl?: string;
    meta?: Record<string, unknown>;
    libraries?: ExternalLibrary[];
    theme?: ThemeConfig;
    storage?: StorageConfig;
    features?: FeaturesConfig;
    activeTabs?: readonly (AvailableTab | string)[];
    views?: readonly ViewDefinition[];
    sidebar?: SidebarConfig;
    hotkeys?: HotkeyRule[];
    onMount?: (ctx: OnMountContext) => void;
    onCleanup?: () => void;
}
