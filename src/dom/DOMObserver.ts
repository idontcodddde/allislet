export type DOMCallback = (element: Element) => void;

interface DOMSubscription {
    selector: string;
    callback: DOMCallback;
}

export class DOMObserverManager {
    private observer: MutationObserver | null = null;
    private attachListeners: Set<DOMSubscription> = new Set();
    private detachListeners: Set<DOMSubscription> = new Set();
    private isObserving = false;

    private ensureStarted(): void {
        if (this.isObserving) return;
        this.observer = new MutationObserver((mutations) =>
            this.handleMutations(mutations)
        );
        this.observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });
        this.isObserving = true;
    }

    private handleMutations(mutations: MutationRecord[]): void {
        for (const mutation of mutations) {
            // Handle Added Nodes
            if (
                mutation.addedNodes.length > 0 && this.attachListeners.size > 0
            ) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as Element;
                        this.attachListeners.forEach((sub) => {
                            if (el.matches(sub.selector)) {
                                sub.callback(el);
                            }
                            el.querySelectorAll(sub.selector).forEach(
                                (child) => {
                                    sub.callback(child);
                                },
                            );
                        });
                    }
                });
            }

            // Handle Removed Nodes
            if (
                mutation.removedNodes.length > 0 &&
                this.detachListeners.size > 0
            ) {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as Element;
                        this.detachListeners.forEach((sub) => {
                            if (el.matches(sub.selector)) {
                                sub.callback(el);
                            }
                            el.querySelectorAll(sub.selector).forEach(
                                (child) => {
                                    sub.callback(child);
                                },
                            );
                        });
                    }
                });
            }
        }
    }

    /**
     * Triggers a callback whenever matching elements are injected into the host DOM.
     */
    onAttach(selector: string, callback: DOMCallback): () => void {
        this.ensureStarted();
        const sub: DOMSubscription = { selector, callback };
        this.attachListeners.add(sub);
        return () => {
            this.attachListeners.delete(sub);
        };
    }

    /**
     * Triggers a callback whenever matching host elements are destroyed.
     */
    onDetach(selector: string, callback: DOMCallback): () => void {
        this.ensureStarted();
        const sub: DOMSubscription = { selector, callback };
        this.detachListeners.add(sub);
        return () => {
            this.detachListeners.delete(sub);
        };
    }

    disconnect(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.isObserving = false;
        }
    }
}

export const DOMObserver = new DOMObserverManager();
