import { FetchPatchRules } from '../network/PatchFetch';
import { XHRPatchRules } from '../network/PatchXHR';
export interface ConfigOptions {
    features?: {
        patchFetch?: boolean | FetchPatchRules;
        patchXHR?: boolean | XHRPatchRules;
        interceptSockets?: boolean;
        autoExtractBearer?: boolean;
    };
}
export declare function initNetworkEngine(config: ConfigOptions): void;
export declare function destroyNetworkEngine(): void;
