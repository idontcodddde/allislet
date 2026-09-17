export declare class Highlighter {
    private static activeOverlays;
    /**
     * Draws a non-destructive visual overlay box over target DOM element.
     */
    static outline(node: Element, customStyle?: Partial<CSSStyleDeclaration>): HTMLElement;
    /**
     * Removes all active highlight overlays from the page.
     */
    static clearAll(): void;
}
