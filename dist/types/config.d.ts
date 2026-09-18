import { ThemeConfig } from './theme';
import { StorageConfig } from './storage';
import { FeaturesConfig, HotkeyRule } from './features';
import { AvailableTab } from './tabs';
import { OnMountContext } from './lifecycle';
import { ExternalLibrary } from './libs';
import { ViewDefinition } from '../views';
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
