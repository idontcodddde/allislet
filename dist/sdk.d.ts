import { AllisletConfig } from './types/config';
import { WindowConfig } from './windows/types';
import { GlobalStorage } from './core/GlobalStorage';
import { AllisletSDKOptions } from './types/runtime';
import { ViewDefinition } from './views';
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
    addView(view: ViewDefinition): () => void;
    registerView(view: ViewDefinition): () => void;
    removeView(id: string): boolean;
    unregisterView(id: string): boolean;
}
