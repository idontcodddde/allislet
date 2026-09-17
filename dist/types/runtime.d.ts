import { ComponentChildren } from 'preact';
import { AllisletConfig } from './config';
import { AntiDetect } from '../core/AntiDetect';
import { EventBus } from '../core/EventBus';
import { GlobalStorage } from '../core/GlobalStorage';
import { PageExecutor } from '../core/PageExecutor';
export interface AllisletEnvironment {
    document?: Document;
    window?: Window;
}
export interface AllisletRuntimeContext {
    config: AllisletConfig;
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
    host: HTMLElement;
    root: ShadowRoot;
    renderTarget: HTMLElement;
}
export type AllisletRenderer = (context: AllisletRuntimeContext) => void | (() => void);
export interface AllisletSDKOptions extends AllisletEnvironment {
    /**
     * Render the built-in shell by default. Set false for a headless SDK
     * or provide renderApp for any UI framework.
     */
    builtInUI?: boolean;
    renderApp?: AllisletRenderer;
    mountTarget?: HTMLElement;
    services?: {
        eventBus?: EventBus;
        storage?: GlobalStorage;
        pageExec?: PageExecutor;
        antiDetect?: AntiDetect;
    };
}
export type AllisletComponent = ComponentChildren;
