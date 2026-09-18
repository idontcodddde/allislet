import { AllisletSDK } from './sdk';
import { createAllislet, defineConfig } from './index';
export * from './index';
declare global {
    interface Window {
        Allislet: typeof AllisletSDK;
        createAllislet: typeof createAllislet;
    }
}
export { AllisletSDK, createAllislet, defineConfig };
