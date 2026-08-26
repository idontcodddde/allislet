import { MacroAction, MacroActionType } from "./types";
import { getUniqueSelectorFromPath, queryCrossBoundaries } from "./domUtils";

type Listener = (actions: MacroAction[]) => void;

export class MacroRecorder {
  private isRecording = false;
  private actions: MacroAction[] = [];
  private startTime = 0;
  private lastEventTime = 0;
  private subscribers: Set<Listener> = new Set();
  private inputDebounceMap: Map<string, ReturnType<typeof setTimeout>> = new Map();

  private boundOnClick = this.handleClick.bind(this);
  private boundOnInput = this.handleInput.bind(this);

  public subscribe(fn: Listener): () => void {
    this.subscribers.add(fn);
    fn([...this.actions]);
    return () => this.subscribers.delete(fn);
  }

  private notify(): void {
    this.subscribers.forEach((cb) => cb([...this.actions]));
  }

  public start(): void {
    if (this.isRecording) return;
    this.isRecording = true;
    this.actions = [];
    this.startTime = Date.now();
    this.lastEventTime = this.startTime;

    window.addEventListener("click", this.boundOnClick, true);
    window.addEventListener("input", this.boundOnInput, true);
    this.notify();
  }

  public stop(): void {
    if (!this.isRecording) return;
    this.isRecording = false;

    window.removeEventListener("click", this.boundOnClick, true);
    window.removeEventListener("input", this.boundOnInput, true);
    this.notify();
  }

  public clear(): void {
    this.actions = [];
    this.notify();
  }

  public getActions(): MacroAction[] {
    return [...this.actions];
  }

  private recordAction(type: MacroActionType, selector: string, extra: Partial<MacroAction> = {}): void {
    if (!selector) return;

    const now = Date.now();
    const delay = now - this.lastEventTime;
    this.lastEventTime = now;

    this.actions.push({
      type,
      selector,
      timestamp: now - this.startTime,
      delay,
      ...extra,
    });

    this.notify();
  }

  private handleClick(e: MouseEvent): void {
    if (!this.isRecording) return;

    const path = e.composedPath();
    const selector = getUniqueSelectorFromPath(path);
    if (!selector) return;

    this.recordAction("click", selector);
  }

  private handleInput(e: Event): void {
    if (!this.isRecording) return;

    const path = e.composedPath();
    const selector = getUniqueSelectorFromPath(path);
    if (!selector) return;

    const target = (path[0] || e.target) as HTMLInputElement | HTMLTextAreaElement;
    const value = target.value ?? "";

    if (this.inputDebounceMap.has(selector)) {
      clearTimeout(this.inputDebounceMap.get(selector)!);
    }

    this.inputDebounceMap.set(
      selector,
      setTimeout(() => {
        const existingIdx = this.actions.findLastIndex(
          (a) => a.type === "input" && a.selector === selector
        );

        if (existingIdx !== -1 && Date.now() - this.startTime - this.actions[existingIdx].timestamp < 1500) {
          this.actions[existingIdx].value = value;
          this.notify();
        } else {
          this.recordAction("input", selector, { value });
        }
        this.inputDebounceMap.delete(selector);
      }, 300)
    );
  }

  public async play(actionsToPlay: MacroAction[] = this.actions): Promise<void> {
    for (const action of actionsToPlay) {
      await new Promise((res) => setTimeout(res, Math.min(action.delay, 1000)));

      const el = queryCrossBoundaries(action.selector);
      if (!el) continue;

      if (action.type === "click") {
        el.click();
      } else if (action.type === "input" && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
        const nativeSetter =
          Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set ||
          Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          )?.set;

        if (nativeSetter) {
          nativeSetter.call(el, action.value ?? "");
        } else {
          el.value = action.value ?? "";
        }

        el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        el.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      }
    }
  }
}
