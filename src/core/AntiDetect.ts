export interface AntiDetectOptions {
    stripStackTraces?: boolean;
    prefix?: string;
}

export class AntiDetect {
    private stripTraces: boolean;
    private prefix: string;
    private assignedGlobals: Map<string, string> = new Map();

    constructor(options: AntiDetectOptions = {}) {
        this.stripTraces = options.stripStackTraces ?? true;
        this.prefix = options.prefix || "__allislet_";
    }

    /**
     * Modifies Error objects to strip out framework stack lines (allislet, blob URLs, extensions).
     */
    stripStackTraces(error: unknown): unknown {
        if (!this.stripTraces || !(error instanceof Error) || !error.stack) {
            return error;
        }

        const cleanedStack = error.stack
            .split("\n")
            .filter((line) => {
                const lower = line.toLowerCase();
                return (
                    !lower.includes("allislet") &&
                    !lower.includes("blob:") &&
                    !lower.includes("chrome-extension:") &&
                    !lower.includes("moz-extension:")
                );
            })
            .join("\n");

        error.stack = cleanedStack;
        return error;
    }

    /**
     * Generates a randomized variable handle for global scope attachments.
     * Prevents host scripts from detecting fixed global properties (e.g., window.__ALLISLET_CORE__).
     */
    randomizeGlobals<T = any>(
        key: string,
        value: T,
        target: any = window,
    ): string {
        if (this.assignedGlobals.has(key)) {
            return this.assignedGlobals.get(key)!;
        }

        // Generate random hash, _0x9f2a4b8c
        const randomHash = Math.random().toString(36).substring(2, 10);
        const randomizedKey = `${this.prefix}${randomHash}`;

        Object.defineProperty(target, randomizedKey, {
            value,
            writable: true,
            configurable: true,
            enumerable: false,
        });

        this.assignedGlobals.set(key, randomizedKey);
        return randomizedKey;
    }

    /**
     * Retrieves a previously attached randomized global variable by its alias key.
     */
    getGlobal<T = any>(key: string, target: any = window): T | undefined {
        const randomizedKey = this.assignedGlobals.get(key);
        return randomizedKey ? target[randomizedKey] : undefined;
    }
}

export const antiDetect = new AntiDetect({
    stripStackTraces: true,
    prefix: "__allislet_",
});
