import type { AllisletConfig } from "../types/config";
import { initAppMetadata } from "./AppMetadata";
import { LibraryLoader } from "./LibraryLoader";
import { setGlobalDataUrl } from "../hooks/useData";
import { initNetworkEngine } from "./Engine";

export async function initAllislet(config: AllisletConfig): Promise<void> {
    initAppMetadata(config);

    if (config.dataUrl) {
        setGlobalDataUrl(config.dataUrl);
    }

    if (config.libraries && config.libraries.length > 0) {
        await LibraryLoader.loadAll(config.libraries);
    }

    initNetworkEngine(config);
}
