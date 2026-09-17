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

let globalDataUrl: string | null = null;

export function setGlobalDataUrl(url: string): void {
    globalDataUrl = url;
}

function resolveBaseUrl(customUrl?: string): string {
    if (customUrl) return customUrl.replace(/\/$/, "");
    if (globalDataUrl) return globalDataUrl.replace(/\/$/, "");

    const isDev =
        (typeof process !== "undefined" && process.env?.NODE_ENV === "development") ||
        (typeof import.meta !== "undefined" && import.meta.env?.DEV);

    if (isDev) {
        return "http://localhost:5173/data";
    }

    return "/data";
}

export async function useData<T = unknown>(
    key: string,
    options: UseDataOptions<T> = {}
): Promise<UseDataResult<T>> {
    const result: UseDataResult<T> = {
        data: null,
        error: null,
        pending: true,
        status: "pending",
        refresh: async () => fetchExecution(),
    };

    async function fetchExecution(): Promise<UseDataResult<T>> {
        result.pending = true;
        result.status = "pending";

        const baseUrl = resolveBaseUrl(options.baseUrl);
        const fileName = key.endsWith(".json") ? key : `${key}.json`;
        const fetchUrl = `${baseUrl}/${fileName}`;

        try {
            const res = await fetch(fetchUrl, {
                headers: {
                    Accept: "application/json",
                    ...options.headers,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: Failed to fetch ${fetchUrl}`);
            }

            const rawJson: unknown = await res.json();
            result.data = options.transform 
                ? options.transform(rawJson) 
                : (rawJson as T);
            result.error = null;
            result.status = "success";
        } catch (err: unknown) {
            result.data = null;
            result.error = err instanceof Error ? err : new Error(String(err));
            result.status = "error";
        } finally {
            result.pending = false;
        }

        return result;
    }

    return await fetchExecution();
}
