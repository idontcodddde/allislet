import { AllisletSDK } from "./sdk";
import { createAllislet } from "./index";
import { defineConfig } from "./index";

declare global {
    interface Window {
        Allislet: typeof AllisletSDK;
        createAllislet: typeof createAllislet;
    }
}

if (typeof window !== "undefined") {
    window.Allislet = AllisletSDK;
    window.createAllislet = createAllislet;
}

export { AllisletSDK, createAllislet, defineConfig };
