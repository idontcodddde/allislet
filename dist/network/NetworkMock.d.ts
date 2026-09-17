export type RulePattern = string | RegExp;
export interface MockRule {
    type: "silent200" | "drop" | "delay";
    pattern: RulePattern;
    payload?: unknown;
    delayMs?: number;
}
export declare class NetworkMockManager {
    private rules;
    /**
     * Intercepts matching requests and resolves with HTTP 200 + custom mock payload.
     */
    silent200(urlPattern: RulePattern, payload?: unknown): void;
    /**
     * Causes matching network requests to drop or hang indefinitely.
     */
    drop(urlPattern: RulePattern): void;
    /**
     * Delays matching responses by specified milliseconds.
     */
    simulateLatency(urlPattern: RulePattern, ms: number): void;
    findMatch(url: string): MockRule | undefined;
    clear(): void;
}
export declare const NetworkMock: NetworkMockManager;
