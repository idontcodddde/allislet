import type { AllisletConfig } from "../types/config";
import { initAppMetadata } from "./AppMetadata";
import { LibraryLoader } from "./LibraryLoader";
import { setGlobalDataUrl } from "../hooks/useData";

export async function initAllislet(config: AllisletConfig): Promise<void> {
    initAppMetadata(config);

    if (config.dataUrl) {
        setGlobalDataUrl(config.dataUrl);
    }

    if (config.libraries && config.libraries.length > 0) {
        await LibraryLoader.loadAll(config.libraries);
    }

    if (typeof config.onMount === "function") {
        config.onMount({
            eventBus: (config as any).eventBus,
            pageExec: (config as any).pageExec,
            storage: (config as any).storage,
            antiDetect: (config as any).antiDetect,
        });
    }
}
