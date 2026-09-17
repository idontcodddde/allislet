export interface SpeechOptions {
    rate?: number;
    pitch?: number;
    lang?: string;
}
export declare class SpeechEngine {
    static speak(text: string, opts?: SpeechOptions): void;
    static stop(): void;
}
