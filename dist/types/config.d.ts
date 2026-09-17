import { ThemeConfig } from './theme';
import { StorageConfig } from './storage';
import { FeaturesConfig, HotkeyRule } from './features';
import { AvailableTab } from './tabs';
import { OnMountContext } from './lifecycle';
import { ExternalLibrary } from './libs';
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
    activeTabs?: AvailableTab[];
    hotkeys?: HotkeyRule[];
    onMount?: (ctx: OnMountContext) => void;
    onCleanup?: () => void;
}
