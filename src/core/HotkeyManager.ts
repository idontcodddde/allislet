export interface HotkeyConfig {
    combo: string;
    action: string;
}

export interface EventBus {
    emit(event: string, ...args: any[]): void;
    on?(event: string, callback: (...args: any[]) => void): void;
}

export class HotkeyManager {
    private hotkeys: HotkeyConfig[] = [];
    private eventBus: EventBus | null = null;
    private boundKeyDownHandler: ((e: KeyboardEvent) => void) | null = null;

    /**
     * Initializes hotkey listeners and binds them to the event bus.
     */
    public init(hotkeys: HotkeyConfig[], eventBus: EventBus): void {
        this.hotkeys = hotkeys;
        this.eventBus = eventBus;

        this.boundKeyDownHandler = this.handleKeyDown.bind(this);
        window.addEventListener("keydown", this.boundKeyDownHandler, true);
    }

    /**
     * Removes event listeners and clears active hotkey bindings.
     */
    public destroy(): void {
        if (this.boundKeyDownHandler) {
            window.removeEventListener(
                "keydown",
                this.boundKeyDownHandler,
                true,
            );
            this.boundKeyDownHandler = null;
        }
        this.hotkeys = [];
        this.eventBus = null;
    }

    private handleKeyDown(e: KeyboardEvent): void {
        // Ignore keydown events when typing inside text inputs unless modifier keys (Alt/Ctrl/Meta) are active
        const target = e.target as HTMLElement | null;
        const isInputField = target &&
            (target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable);

        for (const hk of this.hotkeys) {
            if (this.matchesCombo(e, hk.combo)) {
                // If it's a plain key press inside an input, skip triggering
                if (isInputField && !e.altKey && !e.ctrlKey && !e.metaKey) {
                    continue;
                }

                e.preventDefault();
                e.stopPropagation();

                this.eventBus?.emit(hk.action, {
                    combo: hk.combo,
                    originalEvent: e,
                });
                break;
            }
        }
    }

    private matchesCombo(e: KeyboardEvent, comboStr: string): boolean {
        const parts = comboStr.split("+").map((p) => p.trim().toLowerCase());

        const needsAlt = parts.includes("alt");
        const needsCtrl = parts.includes("ctrl") || parts.includes("control");
        const needsShift = parts.includes("shift");
        const needsMeta = parts.includes("meta") || parts.includes("cmd") ||
            parts.includes("command");

        const targetKey = parts.find(
            (p) =>
                !["alt", "ctrl", "control", "shift", "meta", "cmd", "command"]
                    .includes(p),
        );

        if (e.altKey !== needsAlt) return false;
        if (e.ctrlKey !== needsCtrl) return false;
        if (e.shiftKey !== needsShift) return false;
        if (e.metaKey !== needsMeta) return false;

        if (targetKey) {
            return e.key.toLowerCase() === targetKey;
        }

        return false;
    }
}

export const hotkeyManager = new HotkeyManager();
