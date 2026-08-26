import { FetchPatchRules, patchFetch } from "../network/PatchFetch";
import { patchXHR, XHRPatchRules } from "../network/PatchXHR";
import { wsManager } from "./WebSocketManager";
import { BearerExtractor } from "../network/BearerExtractor";

export interface ConfigOptions {
    features?: {
        patchFetch?: boolean | FetchPatchRules;
        patchXHR?: boolean | XHRPatchRules;
        interceptSockets?: boolean;
        autoExtractBearer?: boolean;
    };
}

export function initNetworkEngine(config: ConfigOptions): void {
    const { features } = config;

    BearerExtractor.enabled = Boolean(features?.autoExtractBearer);

    if (features?.patchFetch) {
        const rules = typeof features.patchFetch === "object"
            ? features.patchFetch
            : {};
        patchFetch(rules);
    }

    if (features?.patchXHR) {
        const rules = typeof features.patchXHR === "object"
            ? features.patchXHR
            : {};
        patchXHR(rules);
    }

    if (features?.interceptSockets) {
        wsManager.hook();
    } else {
        wsManager.unhook();
    }
}
