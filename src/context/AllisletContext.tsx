import { createContext, ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';
import type { AllisletConfig } from '../types';
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

const AllisletContext = createContext<AllisletContextValue | null>(null);

export interface AllisletProviderProps {
    config: AllisletConfig;
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
    children: ComponentChildren;
}

export function AllisletProvider({
    config,
    eventBus,
    pageExec,
    storage,
    antiDetect,
    children,
}: AllisletProviderProps) {
    const value: AllisletContextValue = {
        config,
        eventBus,
        pageExec,
        storage,
        antiDetect,
    };

    return (
        <AllisletContext.Provider value={value}>
            {children}
        </AllisletContext.Provider>
    );
}

/**
 * Universal hook to access Allislet Framework services inside any UI component or custom tab.
 */
export function useAllislet(): AllisletContextValue {
    const ctx = useContext(AllisletContext);
    if (!ctx) {
        throw new Error('[Allislet] useAllislet() must be used within an <AllisletProvider />');
    }
    return ctx;
}