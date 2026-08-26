export type RulePattern = string | RegExp;

export interface MockRule {
    type: "silent200" | "drop" | "delay";
    pattern: RulePattern;
    payload?: any;
    delayMs?: number;
}

export class NetworkMockManager {
    private rules: MockRule[] = [];

    /**
     * Intercepts matching requests and resolves with HTTP 200 + custom mock payload.
     */
    silent200(urlPattern: RulePattern, payload: any = {}): void {
        this.rules.push({ type: "silent200", pattern: urlPattern, payload });
    }

    /**
     * Causes matching network requests to drop or hang indefinitely.
     */
    drop(urlPattern: RulePattern): void {
        this.rules.push({ type: "drop", pattern: urlPattern });
    }

    /**
     * Delays matching responses by specified milliseconds.
     */
    simulateLatency(urlPattern: RulePattern, ms: number): void {
        this.rules.push({ type: "delay", pattern: urlPattern, delayMs: ms });
    }

    findMatch(url: string): MockRule | undefined {
        return this.rules.find((r) =>
            typeof r.pattern === "string"
                ? url.includes(r.pattern)
                : r.pattern.test(url)
        );
    }

    clear(): void {
        this.rules = [];
    }
}

export const NetworkMock = new NetworkMockManager();
