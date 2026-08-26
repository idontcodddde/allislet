import { EventBus } from "../core/EventBus";

export interface HotkeyRule {
  combo: string;
  action: string; 
}

export class HotkeyManager {
  private hotkeys: HotkeyRule[];
  private bus: EventBus;
  private boundHandler: (e: KeyboardEvent) => void;

  constructor(bus: EventBus, hotkeys: HotkeyRule[] = []) {
    this.bus = bus;
    this.hotkeys = hotkeys;
    this.boundHandler = this.handleKeyDown.bind(this);
  }

  public start(): void {
    window.addEventListener("keydown", this.boundHandler, true);
  }

  public stop(): void {
    window.removeEventListener("keydown", this.boundHandler, true);
  }

  public updateHotkeys(newHotkeys: HotkeyRule[]): void {
    this.hotkeys = newHotkeys;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    const pressedCombo = this.parseEvent(e);

    for (const rule of this.hotkeys) {
      if (rule.combo.toLowerCase() === pressedCombo) {
        e.preventDefault();
        e.stopPropagation();
        this.bus.emit(rule.action, { combo: rule.combo, originalEvent: e });
        break;
      }
    }
  }

  private parseEvent(e: KeyboardEvent): string {
    const parts: string[] = [];
    if (e.ctrlKey) parts.push("ctrl");
    if (e.altKey) parts.push("alt");
    if (e.shiftKey) parts.push("shift");
    if (e.metaKey) parts.push("meta");

    const key = e.key.toLowerCase();
    if (!["control", "alt", "shift", "meta"].includes(key)) {
      parts.push(key);
    }

    return parts.join("+");
  }
}
