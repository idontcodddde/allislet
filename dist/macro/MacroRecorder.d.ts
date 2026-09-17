export type MacroActionType = "click" | "input" | "scroll";
export interface MacroAction {
    type: MacroActionType;
    selector: string;
    timestamp: number;
    delay: number;
    value?: string;
    scrollX?: number;
    scrollY?: number;
}
export interface PlayOptions {
    speed?: number;
    onStep?: (action: MacroAction, index: number) => void;
}
export declare class MacroRecorder {
    private isRecording;
    private isPlaying;
    private actions;
    private startTime;
    private lastEventTime;
    private scrollTimeout;
    private lastRecordedEvent;
    private activeTargets;
    private boundOnClick;
    private boundOnInput;
    private boundOnScroll;
    constructor();
    private isIgnoredTarget;
    start(): void;
    stop(): MacroAction[];
    private recordAction;
    private handleClick;
    private handleInput;
    private handleScroll;
    play(actions: MacroAction[], options?: PlayOptions): Promise<void>;
    stopPlayback(): void;
}
