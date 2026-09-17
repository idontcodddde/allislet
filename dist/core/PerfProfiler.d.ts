export declare class PerfProfiler {
    private static marks;
    static startMark(label: string): void;
    static endMark(label: string): number;
}
