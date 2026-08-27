export interface DragOptions {
    handleSelector?: string;
    enabled?: boolean;
}

export class DragController {
    private element: HTMLElement;
    private handle: HTMLElement;
    private isDragging = false;
    private startX = 0;
    private startY = 0;
    private initialLeft = 0;
    private initialTop = 0;

    private boundOnMouseDown: (e: MouseEvent) => void;
    private boundOnMouseMove: (e: MouseEvent) => void;
    private boundOnMouseUp: (e: MouseEvent) => void;

    constructor(element: HTMLElement, options: DragOptions = {}) {
        this.element = element;
        if (options.handleSelector) {
            this.handle =
                element.querySelector(options.handleSelector) as HTMLElement ||
                element;
        } else {
            this.handle = element;
        }

        this.boundOnMouseDown = this.handleMouseDown.bind(this);
        this.boundOnMouseMove = this.handleMouseMove.bind(this);
        this.boundOnMouseUp = this.handleMouseUp.bind(this);

        if (options.enabled) {
            this.enable();
        }
    }

    public enable(): void {
        this.handle.style.cursor = "grab";
        this.handle.addEventListener("mousedown", this.boundOnMouseDown);
    }

    public disable(): void {
        this.handle.style.cursor = "";
        this.handle.removeEventListener("mousedown", this.boundOnMouseDown);
        this.destroy();
    }

    private handleMouseDown(e: MouseEvent): void {
        if (e.button !== 0) return;
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        const rect = this.element.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;

        this.handle.style.cursor = "grabbing";
        window.addEventListener("mousemove", this.boundOnMouseMove);
        window.addEventListener("mouseup", this.boundOnMouseUp);
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        this.element.style.position = "fixed";
        this.element.style.left = `${this.initialLeft + deltaX}px`;
        this.element.style.top = `${this.initialTop + deltaY}px`;
    }

    private handleMouseUp(): void {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.handle.style.cursor = "grab";
        window.removeEventListener("mousemove", this.boundOnMouseMove);
        window.removeEventListener("mouseup", this.boundOnMouseUp);
    }

    public destroy(): void {
        window.removeEventListener("mousemove", this.boundOnMouseMove);
        window.removeEventListener("mouseup", this.boundOnMouseUp);
    }
}
