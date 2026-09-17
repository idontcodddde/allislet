export interface LogEntry {
    type: "log" | "warn" | "error";
    args: unknown[];
    timestamp: Date;
}
export declare class ConsoleRedirector {
    private static logs;
    private static originalLog;
    private static originalWarn;
    private static originalError;
    private static isCaptured;
    static capture(): void;
    static release(): void;
    static getLogs(): LogEntry[];
    static clearLogs(): void;
}
