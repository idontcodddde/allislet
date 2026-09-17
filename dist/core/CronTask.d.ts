export declare class CronTask {
    static schedule(intervalMs: number, callback: () => void): () => void;
}
