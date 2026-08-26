export interface FeaturesConfig {
    patchFetch?: boolean;
    patchXHR?: boolean;
    interceptSockets?: boolean;
    autoExtractBearer?: boolean;
}

export interface HotkeyRule {
    combo: string;
    action: string;
}
