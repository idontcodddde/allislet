export interface ShadowMountHandle {
    host: HTMLElement;
    root: ShadowRoot;
    destroy(): void;
}
export declare class HostReset {
    static apply(host: HTMLElement): void;
    static injectBaseStyles(root: ShadowRoot, ownerDocument: Document): void;
}
export declare class ShadowMount {
    static create(id: string, positionStyles: Partial<CSSStyleDeclaration>, options?: {
        document?: Document;
        parent?: Node;
    }): ShadowMountHandle;
}
