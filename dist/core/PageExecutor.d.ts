import { AntiDetect } from './AntiDetect';
export declare class PageExecutor {
    private antiDetect;
    constructor(antiDetect?: AntiDetect);
    /**
     * Evaluates code synchronously in the host window context.
     */
    run<T = unknown>(codeOrFn: string | ((...args: unknown[]) => T), ...args: unknown[]): T;
    /**
     * Asynchronously executes code or functions in the main thread context and returns a Promise.
     */
    runAsync<T = unknown>(codeOrFn: string | ((...args: unknown[]) => Promise<T> | T), ...args: unknown[]): Promise<T>;
    /**
     * CSP-Safe Execution: Injects code via Blob URL scripts when strict CSP blocks inline Function/eval evaluation.
     */
    injectViaBlob(code: string): Promise<void>;
    /**
     * Helper method for framework view calls: attempts fast inline execution and automatically
     * falls back to Blob script injection if CSP restricts `eval`/`Function`.
     */
    runInMainWorld<T = unknown>(codeOrFn: string | ((...args: unknown[]) => T), ...args: unknown[]): Promise<T>;
}
export declare const pageExec: PageExecutor;
