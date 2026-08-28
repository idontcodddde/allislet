export class AsyncQueue {
    private queue: Array<() => Promise<any>> = [];
    private running = false;
    private delayMs: number;

    constructor(delayMs: number = 0) {
        this.delayMs = delayMs;
    }

    public add<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
            this.process();
        });
    }

    private async process(): Promise<void> {
        if (this.running || this.queue.length === 0) return;
        this.running = true;

        while (this.queue.length > 0) {
            const currentTask = this.queue.shift();
            if (currentTask) {
                await currentTask();
                if (this.delayMs > 0 && this.queue.length > 0) {
                    await new Promise((res) => setTimeout(res, this.delayMs));
                }
            }
        }

        this.running = false;
    }

    public clear(): void {
        this.queue = [];
    }

    public get size(): number {
        return this.queue.length;
    }
}
