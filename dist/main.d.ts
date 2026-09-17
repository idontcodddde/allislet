import { AllisletConfig } from './types/config';
import { ShadowMountHandle } from './core/ShadowMount';
import { AllisletSDKOptions } from './types/runtime';
export interface MountResult {
    mount: ShadowMountHandle;
    renderTarget: HTMLElement;
    stopPositionTracking: () => void;
    stopRenderer: () => void;
}
export declare function mountAllislet(config: AllisletConfig, options?: AllisletSDKOptions): Promise<MountResult>;
export declare function mount(config: AllisletConfig, options?: AllisletSDKOptions): Promise<MountResult>;
