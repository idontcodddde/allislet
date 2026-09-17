export declare class WorkerOffloader {
    static run<T>(fn: (...args: unknown[]) => T, args?: unknown[]): Promise<T>;
}
