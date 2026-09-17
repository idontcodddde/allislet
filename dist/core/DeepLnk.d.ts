export type ActionHandler = (params: Record<string, string>) => void;
export declare class DeepLnk {
    private static handlers;
    private static initialized;
    static create(action: string, params?: Record<string, string | number | boolean>): string;
    static register(action: string, handler: ActionHandler): () => void;
    static init(): void;
    static executeFromHash: () => void;
}
