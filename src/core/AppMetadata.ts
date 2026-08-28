import type { AllisletConfig } from "../types/config";

export interface AppMetadata {
    id: string;
    name: string;
    version: string;
    [key: string]: any;
}

declare global {
    interface Window {
        app: AppMetadata;
    }
}

let currentAppMeta: AppMetadata = {
    id: "allislet-app",
    name: "Allislet App",
    version: "1.0.0",
};

export const app: AppMetadata = new Proxy(currentAppMeta, {
    get(target, prop) {
        if (typeof window !== "undefined" && window.app) {
            return window.app[prop as keyof AppMetadata];
        }
        return target[prop as keyof AppMetadata];
    },
});

export function initAppMetadata(config: AllisletConfig): AppMetadata {
    const meta: AppMetadata = {
        id: config.id || "allislet-app",
        name: config.name || "Allislet App",
        version: config.version || "1.0.0",
        // ...config,
    };

    currentAppMeta = meta;

    if (typeof window !== "undefined") {
        window.app = meta;
    }

    return meta;
}
