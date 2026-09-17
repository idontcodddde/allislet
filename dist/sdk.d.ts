import { AllisletConfig } from './types/config';
import { WindowConfig } from './windows/types';
import { GlobalStorage } from './core/GlobalStorage';
import { AllisletSDKOptions } from './types/runtime';
export declare class AllisletSDK {
    private readonly options;
    readonly config: AllisletConfig;
    private lifecycle;
    private mounted;
    constructor(config: AllisletConfig, options?: AllisletSDKOptions);
    static create(config: AllisletConfig, options?: AllisletSDKOptions): AllisletSDK;
    mount(): Promise<void>;
    destroy(): void;
    openWindow(id: string, options: Omit<WindowConfig, "id">): void;
    closeWindow(id: string): void;
    getStorage(): GlobalStorage;
}
