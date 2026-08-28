export interface LogEntry {
    type: "log" | "warn" | "error";
    args: any[];
    timestamp: Date;
}

export class ConsoleRedirector {
    private static logs: LogEntry[] = [];
    private static originalLog = console.log;
    private static originalWarn = console.warn;
    private static originalError = console.error;
    private static isCaptured = false;

    public static capture(): void {
        if (ConsoleRedirector.isCaptured) return;
        ConsoleRedirector.isCaptured = true;

        console.log = (...args: any[]) => {
            ConsoleRedirector.logs.push({
                type: "log",
                args,
                timestamp: new Date(),
            });
            ConsoleRedirector.originalLog.apply(console, args);
        };

        console.warn = (...args: any[]) => {
            ConsoleRedirector.logs.push({
                type: "warn",
                args,
                timestamp: new Date(),
            });
            ConsoleRedirector.originalWarn.apply(console, args);
        };

        console.error = (...args: any[]) => {
            ConsoleRedirector.logs.push({
                type: "error",
                args,
                timestamp: new Date(),
            });
            ConsoleRedirector.originalError.apply(console, args);
        };
    }

    public static release(): void {
        if (!ConsoleRedirector.isCaptured) return;
        console.log = ConsoleRedirector.originalLog;
        console.warn = ConsoleRedirector.originalWarn;
        console.error = ConsoleRedirector.originalError;
        ConsoleRedirector.isCaptured = false;
    }

    public static getLogs(): LogEntry[] {
        return [...ConsoleRedirector.logs];
    }

    public static clearLogs(): void {
        ConsoleRedirector.logs = [];
    }
}
