export declare class ElementPicker {
    private hoverOverlay;
    private resolvePromise;
    private isActive;
    private boundOnMouseMove;
    private boundOnClick;
    private boundOnKeyDown;
    constructor();
    /**
     * Enables interactive element picking. Resolves to the next clicked host element.
     */
    pick(): Promise<Element | null>;
    private handleMouseMove;
    private handleClick;
    private handleKeyDown;
    private removeHoverOverlay;
    private finish;
    cancel(): void;
}
