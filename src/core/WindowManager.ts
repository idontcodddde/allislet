export class WindowManager {
    private hostElement: HTMLElement | null = null;
    private shadowRoot: ShadowRoot | null = null;
    private targetContainer: HTMLElement | null = null;
    private activeHandle: HTMLElement | null = null;
    private isDragging = false;
    private startX = 0;
    private startY = 0;
    private currentX = 0;
    private currentY = 0;

    /**
     * Attaches delegating pointer listeners to the Shadow Root.
     */
    public attach(hostElement: HTMLElement, shadowRoot: ShadowRoot): void {
        this.hostElement = hostElement;
        this.shadowRoot = shadowRoot;

        shadowRoot.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("pointermove", this.handlePointerMove);
        window.addEventListener("pointerup", this.handlePointerUp);
        window.addEventListener("pointercancel", this.handlePointerUp);
    }

    private handlePointerDown = (evt: Event): void => {
        const e = evt as PointerEvent;
        const path = e.composedPath();

        const dragHandle = path.find(
            (el) =>
                el instanceof HTMLElement &&
                el.hasAttribute("data-window-drag"),
        ) as HTMLElement | undefined;

        if (!dragHandle) return;

        const isInteractive = path.some(
            (el) =>
                el instanceof HTMLElement &&
                (el.tagName === "BUTTON" ||
                    el.tagName === "INPUT" ||
                    el.tagName === "TEXTAREA" ||
                    el.hasAttribute("data-no-drag")),
        );

        if (isInteractive) return;

        this.targetContainer = this.shadowRoot?.querySelector<HTMLElement>(
            "[data-window-container]",
        ) || null;

        if (!this.targetContainer) return;

        this.isDragging = true;
        this.activeHandle = dragHandle;
        this.startX = e.clientX - this.currentX;
        this.startY = e.clientY - this.currentY;

        // Visual feedback & pointer capture
        dragHandle.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        try {
            dragHandle.setPointerCapture(e.pointerId);
        } catch (_) {}

        this.targetContainer.style.transition = "none";
    };

    private handlePointerMove = (evt: Event): void => {
        if (!this.isDragging || !this.targetContainer) return;
        const e = evt as PointerEvent;

        this.currentX = e.clientX - this.startX;
        this.currentY = e.clientY - this.startY;

        this.targetContainer.style.transform =
            `translate3d(${this.currentX}px, ${this.currentY}px, 0px)`;
    };

    private handlePointerUp = (evt: Event): void => {
        if (!this.isDragging) return;
        const e = evt as PointerEvent;

        this.isDragging = false;
        document.body.style.userSelect = "";

        if (this.activeHandle) {
            this.activeHandle.style.cursor = "grab";
            try {
                this.activeHandle.releasePointerCapture(e.pointerId);
            } catch (_) {}
            this.activeHandle = null;
        }

        if (this.targetContainer) {
            this.targetContainer.style.transition = "";
        }
    };

    /**
     * Resets the window position back to center/default alignment.
     */
    public resetPosition(): void {
        this.currentX = 0;
        this.currentY = 0;
        if (this.targetContainer) {
            this.targetContainer.style.transform = `translate3d(0px, 0px, 0px)`;
        }
    }
}

export const windowManager = new WindowManager();
