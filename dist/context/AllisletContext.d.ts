import { ComponentChildren } from 'preact';
import { AllisletConfig } from '../types';
import { EventBus } from '../core/EventBus';
import { PageExecutor } from '../core/PageExecutor';
import { GlobalStorage } from '../core/GlobalStorage';
import { AntiDetect } from '../core/AntiDetect';
export interface AllisletContextValue {
    config: AllisletConfig;
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
}
export type AllisletContextType = AllisletContextValue;
export interface AllisletProviderProps {
    config: AllisletConfig;
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
    children: ComponentChildren;
}
export declare function AllisletProvider({ config, eventBus, pageExec, storage, antiDetect, children, }: AllisletProviderProps): import("preact").JSX.Element;
export declare function useAllislet(): AllisletContextValue;
