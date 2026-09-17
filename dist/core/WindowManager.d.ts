import { ComponentChildren } from 'preact';
import { Signal } from '@preact/signals';
export interface WindowView {
    id: string;
    label: string;
    icon?: string;
    component: ComponentChildren;
}
export interface WindowConfig {
    id: string;
    title: string;
    type?: "component" | "sidebar";
    component?: ComponentChildren;
    views?: WindowView[];
    draggable?: boolean;
    width?: number | string;
    height?: number | string;
    persistentSidebar?: boolean;
    activeTabSignal?: Signal<string>;
}
export declare class WindowManager {
    private hostElement;
    private shadowRoot;
    private activeWindows;
    private persistentTabSignals;
    /**
     * Creates or retrieves a persistent Signal for a specific windowId,
     * backed by localStorage so state survives browser refreshes.
     */
    getTabSignal(windowId: string, defaultTab: string): Signal<string>;
    /**
     * Attaches host elements and root drag listener for the main application window.
     */
    attach(hostElement: HTMLElement, shadowRoot: ShadowRoot): void;
    private handleMainPointerDown;
    resetPosition(id?: string): void;
    private getTranslation;
    openWindow(config: WindowConfig): void;
    closeWindow(id: string): void;
    destroy(): void;
    focusWindow(id: string): void;
    focusMainWindow(): void;
}
export declare const windowManager: WindowManager;
