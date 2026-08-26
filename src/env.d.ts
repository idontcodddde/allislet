/// <reference types="vite/client" />

declare global {
    interface Window {
        // Add any global window properties here if needed
        __ALLISLET_INSTANCE__?: any;
    }
}

export {};
