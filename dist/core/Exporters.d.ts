export declare class CSVExporter {
    static download(filename: string, data: Record<string, unknown>[] | unknown[][]): void;
    private static escapeCell;
    private static triggerDownload;
}
export declare class JSONExporter {
    static download(filename: string, data: unknown): void;
}
