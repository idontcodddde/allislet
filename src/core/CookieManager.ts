export interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date | string;
    maxAge?: number;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
}

export class CookieManager {
    public static getAll(): Record<string, string> {
        if (typeof document === "undefined" || !document.cookie) return {};

        const cookies: Record<string, string> = {};
        const pairs = document.cookie.split(";");

        for (const pair of pairs) {
            const [key, ...valParts] = pair.trim().split("=");
            if (key) {
                cookies[decodeURIComponent(key)] = decodeURIComponent(
                    valParts.join("="),
                );
            }
        }

        return cookies;
    }

    public static set(
        name: string,
        value: string,
        options: CookieOptions = {},
    ): void {
        if (typeof document === "undefined") return;

        let cookieStr = `${encodeURIComponent(name)}=${
            encodeURIComponent(value)
        }`;

        cookieStr += `; path=${options.path ?? "/"}`;

        if (options.domain) cookieStr += `; domain=${options.domain}`;

        if (options.expires) {
            const exp = options.expires instanceof Date
                ? options.expires.toUTCString()
                : options.expires;
            cookieStr += `; expires=${exp}`;
        }

        if (options.maxAge !== undefined) {
            cookieStr += `; max-age=${options.maxAge}`;
        }
        if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
        if (options.secure) cookieStr += `; secure`;

        document.cookie = cookieStr;
    }
}
