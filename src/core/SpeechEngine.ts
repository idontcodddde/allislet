export interface SpeechOptions {
    rate?: number;
    pitch?: number;
    lang?: string;
}

export class SpeechEngine {
    public static speak(text: string, opts: SpeechOptions = {}): void {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            console.warn(
                "SpeechSynthesis API is not supported in this browser.",
            );
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (opts.rate !== undefined) utterance.rate = opts.rate;
        if (opts.pitch !== undefined) utterance.pitch = opts.pitch;
        if (opts.lang !== undefined) utterance.lang = opts.lang;

        window.speechSynthesis.speak(utterance);
    }

    public static stop(): void {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }
}
