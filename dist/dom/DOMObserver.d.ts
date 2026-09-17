export type DOMCallback = (element: Element) => void;
export declare class DOMObserverManager {
    private observer;
    private attachListeners;
    private detachListeners;
    private isObserving;
    private ensureStarted;
    private handleMutations;
    /**
     * Triggers a callback whenever matching elements are injected into the host DOM.
     */
    onAttach(selector: string, callback: DOMCallback): () => void;
    /**
     * Triggers a callback whenever matching host elements are destroyed.
     */
    onDetach(selector: string, callback: DOMCallback): () => void;
    disconnect(): void;
}
export declare const DOMObserver: DOMObserverManager;
