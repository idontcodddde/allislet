import { AllisletConfig } from '../types/config';
export interface AppMetadata {
    id: string;
    name: string;
    version: string;
    [key: string]: unknown;
}
declare global {
    interface Window {
        appMeta: AppMetadata;
    }
}
export declare const app: AppMetadata;
export declare function initAppMetadata(config: AllisletConfig): AppMetadata;
export declare function setAppMeta<K extends string, V>(key: K, value: V): void;
export declare function updateAppMetadata(partialMeta: Record<string, unknown>): void;
