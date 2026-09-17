export interface UseDataOptions<T = unknown> {
    baseUrl?: string;
    headers?: Record<string, string>;
    transform?: (data: unknown) => T;
}
export interface UseDataResult<T> {
    data: T | null;
    error: Error | null;
    pending: boolean;
    status: "idle" | "pending" | "success" | "error";
    refresh: () => Promise<UseDataResult<T>>;
}
export declare function setGlobalDataUrl(url: string): void;
export declare function useData<T = unknown>(key: string, options?: UseDataOptions<T>): Promise<UseDataResult<T>>;
