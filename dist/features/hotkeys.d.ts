import { EventBus } from '../core/EventBus';
export interface HotkeyRule {
    combo: string;
    action: string;
}
export declare class HotkeyManager {
    private hotkeys;
    private bus;
    private boundHandler;
    constructor(bus: EventBus, hotkeys?: HotkeyRule[]);
    start(): void;
    stop(): void;
    updateHotkeys(newHotkeys: HotkeyRule[]): void;
    private handleKeyDown;
    private parseEvent;
}
