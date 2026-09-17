export interface DragOptions {
    handleSelector?: string;
    enabled?: boolean;
}
export declare class DragController {
    private element;
    private handle;
    private isDragging;
    private startX;
    private startY;
    private initialLeft;
    private initialTop;
    private boundOnMouseDown;
    private boundOnMouseMove;
    private boundOnMouseUp;
    constructor(element: HTMLElement, options?: DragOptions);
    enable(): void;
    disable(): void;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    destroy(): void;
}
