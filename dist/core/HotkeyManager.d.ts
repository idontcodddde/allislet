export interface HotkeyConfig {
    combo: string;
    action: string;
}
export interface EventBus {
    emit(event: string, ...args: unknown[]): void;
    on?(event: string, callback: (...args: unknown[]) => void): void;
}
export declare class HotkeyManager {
    private hotkeys;
    private eventBus;
    private boundKeyDownHandler;
    /**
     * Initializes hotkey listeners and binds them to the event bus.
     */
    init(hotkeys: HotkeyConfig[], eventBus: EventBus): void;
    /**
     * Removes event listeners and clears active hotkey bindings.
     */
    destroy(): void;
    private handleKeyDown;
    private matchesCombo;
}
export declare const hotkeyManager: HotkeyManager;
