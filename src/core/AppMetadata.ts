import type { AllisletConfig } from "../types/config";

export interface AppMetadata {
    id: string;
    name: string;
    version: string;
    [key: string]: unknown;
}

declare global {
    interface Window {
        appMeta: AppMetadata;
    }
}

let currentAppMeta: AppMetadata = {
    id: "allislet-app",
    name: "Allislet App",
    version: "1.0.0",
};

export const app: AppMetadata = new Proxy(currentAppMeta, {
    get(target, prop, receiver) {
        if (typeof window !== "undefined" && window.appMeta) {
            return Reflect.get(window.appMeta, prop);
        }
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value) {
        if (typeof window !== "undefined" && window.appMeta) {
            Reflect.set(window.appMeta, prop, value);
        }
        return Reflect.set(target, prop, value);
    },
});

export function initAppMetadata(config: AllisletConfig): AppMetadata {
    const meta: AppMetadata = {
        ...config.meta,
        id: config.id || "allislet-app",
        name: config.name || "Allislet App",
        version: config.version || "1.0.0",
    };

    currentAppMeta = meta;

    if (typeof window !== "undefined") {
        window.appMeta = meta;
    }

    return meta;
}

export function setAppMeta<K extends string, V>(key: K, value: V): void {
    app[key] = value;
}

export function updateAppMetadata(partialMeta: Record<string, unknown>): void {
    Object.assign(app, partialMeta);
}
