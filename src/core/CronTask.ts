export class CronTask {
    public static schedule(
        intervalMs: number,
        callback: () => void,
    ): () => void {
        const intervalId = setInterval(() => {
            try {
                callback();
            } catch (err) {
                console.error("[CronTask] Task execution error:", err);
            }
        }, intervalMs);

        return () => clearInterval(intervalId);
    }
}
