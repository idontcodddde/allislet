import { AntiDetect } from "./AntiDetect";

export class PageExecutor {
    private antiDetect: AntiDetect;

    constructor(antiDetect?: AntiDetect) {
        this.antiDetect = antiDetect ||
            new AntiDetect({ stripStackTraces: true });
    }

    /**
     * Evaluates code synchronously in the host window context.
     */
    run<T = any>(
        codeOrFn: string | ((...args: any[]) => T),
        ...args: any[]
    ): T {
        try {
            if (typeof codeOrFn === "function") {
                return codeOrFn(...args);
            }
            return new Function(`"use strict"; ${codeOrFn}`)();
        } catch (error) {
            this.antiDetect.stripStackTraces(error);
            throw error;
        }
    }

    /**
     * Asynchronously executes code or functions in the main thread context and returns a Promise.
     */
    async runAsync<T = any>(
        codeOrFn: string | ((...args: any[]) => Promise<T> | T),
        ...args: any[]
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                if (typeof codeOrFn === "function") {
                    Promise.resolve(codeOrFn(...args))
                        .then(resolve)
                        .catch((err) => {
                            this.antiDetect.stripStackTraces(err);
                            reject(err);
                        });
                    return;
                }

                const asyncWrapped = `
          return (async () => {
            "use strict";
            ${codeOrFn}
          })();
        `;
                const fn = new Function(asyncWrapped);
                Promise.resolve(fn())
                    .then(resolve)
                    .catch((err) => {
                        this.antiDetect.stripStackTraces(err);
                        reject(err);
                    });
            } catch (error) {
                this.antiDetect.stripStackTraces(error);
                reject(error);
            }
        });
    }

    /**
     * CSP-Safe Execution: Injects code via Blob URL scripts when strict CSP blocks inline Function/eval evaluation.
     */
    injectViaBlob(code: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const blob = new Blob([code], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);
                const script = document.createElement("script");

                script.src = url;
                script.onload = () => {
                    URL.revokeObjectURL(url);
                    script.remove();
                    resolve();
                };
                script.onerror = () => {
                    URL.revokeObjectURL(url);
                    script.remove();
                    const cspErr = new Error(
                        "[Allislet] Blob script execution failed due to CSP rules.",
                    );
                    this.antiDetect.stripStackTraces(cspErr);
                    reject(cspErr);
                };

                (document.head || document.documentElement).appendChild(script);
            } catch (error) {
                this.antiDetect.stripStackTraces(error);
                reject(error);
            }
        });
    }

    /**
     * Helper method for framework view calls: attempts fast inline execution and automatically
     * falls back to Blob script injection if CSP restricts `eval`/`Function`.
     */
    async runInMainWorld<T = any>(
        codeOrFn: string | ((...args: any[]) => T),
        ...args: any[]
    ): Promise<T> {
        try {
            return await this.runAsync(codeOrFn, ...args);
        } catch {
            if (typeof codeOrFn === "string") {
                await this.injectViaBlob(codeOrFn);
                return undefined as unknown as T;
            }
            throw new Error("[Allislet] Main world execution failed.");
        }
    }
}

export const pageExec = new PageExecutor();
