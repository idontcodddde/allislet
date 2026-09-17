export interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date | string;
    maxAge?: number;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
}
export declare class CookieManager {
    static getAll(): Record<string, string>;
    static set(name: string, value: string, options?: CookieOptions): void;
}
