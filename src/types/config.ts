import type { ThemeConfig } from "./theme";
import type { StorageConfig } from "./storage";
import type { FeaturesConfig, HotkeyRule } from "./features";
import type { AvailableTab } from "./tabs";
import type { OnMountContext } from "./lifecycle";

export interface AllisletConfig {
    id: string;
    name: string;
    version: string;
    theme?: ThemeConfig;
    storage?: StorageConfig;
    features?: FeaturesConfig;
    activeTabs?: AvailableTab[];
    hotkeys?: HotkeyRule[];
    onMount?: (ctx: OnMountContext) => void;
    onCleanup?: () => void;
}
