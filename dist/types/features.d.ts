import { FetchPatchRules } from '../network/PatchFetch';
import { XHRPatchRules } from '../network/PatchXHR';
export interface FeaturesConfig {
    patchFetch?: boolean | FetchPatchRules;
    patchXHR?: boolean | XHRPatchRules;
    interceptSockets?: boolean;
    autoExtractBearer?: boolean;
}
export interface HotkeyRule {
    combo: string;
    action: string;
}
