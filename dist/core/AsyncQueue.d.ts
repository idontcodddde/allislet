export declare class AsyncQueue {
    private queue;
    private running;
    private delayMs;
    constructor(delayMs?: number);
    add<T>(task: () => Promise<T>): Promise<T>;
    private process;
    clear(): void;
    get size(): number;
}
