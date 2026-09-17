export interface AntiDetectOptions {
    stripStackTraces?: boolean;
    prefix?: string;
}
export declare class AntiDetect {
    private stripTraces;
    private prefix;
    private assignedGlobals;
    constructor(options?: AntiDetectOptions);
    /**
     * Modifies Error objects to strip out framework stack lines (allislet, blob URLs, extensions).
     */
    stripStackTraces(error: unknown): unknown;
    /**
     * Generates a randomized variable handle for global scope attachments.
     * Prevents host scripts from detecting fixed global properties (e.g., window.__ALLISLET_CORE__).
     */
    randomizeGlobals<T = unknown>(key: string, value: T, target?: object): string;
    /**
     * Retrieves a previously attached randomized global variable by its alias key.
     */
    getGlobal<T = unknown>(key: string, target?: object): T | undefined;
}
export declare const antiDetect: AntiDetect;
