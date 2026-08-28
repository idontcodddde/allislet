export class PerfProfiler {
    private static marks: Map<string, number> = new Map();

    public static startMark(label: string): void {
        if (typeof performance !== "undefined" && performance.mark) {
            performance.mark(`${label}-start`);
        }
        PerfProfiler.marks.set(label, performance.now());
    }

    public static endMark(label: string): number {
        const startTime = PerfProfiler.marks.get(label);
        const endTime = performance.now();
        let duration = 0;

        if (startTime !== undefined) {
            duration = endTime - startTime;
            PerfProfiler.marks.delete(label);
        }

        if (
            typeof performance !== "undefined" && performance.mark &&
            performance.measure
        ) {
            performance.mark(`${label}-end`);
            try {
                performance.measure(label, `${label}-start`, `${label}-end`);
            } catch (_) {}
        }

        console.log(`[PerfProfiler] ${label}: ${duration.toFixed(2)}ms`);
        return duration;
    }
}
