import { Highlighter } from "./Highlighter";

export class ElementPicker {
    private hoverOverlay: HTMLElement | null = null;
    private resolvePromise: ((element: Element | null) => void) | null = null;
    private isActive = false;

    private boundOnMouseMove: (e: MouseEvent) => void;
    private boundOnClick: (e: MouseEvent) => void;
    private boundOnKeyDown: (e: KeyboardEvent) => void;

    constructor() {
        this.boundOnMouseMove = this.handleMouseMove.bind(this);
        this.boundOnClick = this.handleClick.bind(this);
        this.boundOnKeyDown = this.handleKeyDown.bind(this);
    }

    /**
     * Enables interactive element picking. Resolves to the next clicked host element.
     */
    public pick(): Promise<Element | null> {
        if (this.isActive) {
            this.cancel();
        }

        this.isActive = true;

        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            window.addEventListener("mousemove", this.boundOnMouseMove, true);
            window.addEventListener("click", this.boundOnClick, true);
            window.addEventListener("keydown", this.boundOnKeyDown, true);
        });
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.isActive) return;

        const target = e.target as Element | null;
        if (
            !target || target.hasAttribute("data-macro-ignore") ||
            target.closest("[data-macro-ignore]")
        ) {
            this.removeHoverOverlay();
            return;
        }

        this.removeHoverOverlay();
        this.hoverOverlay = Highlighter.outline(target, {
            border: "2px solid #23a55a",
            backgroundColor: "rgba(35, 165, 90, 0.2)",
        });
    }

    private handleClick(e: MouseEvent): void {
        if (!this.isActive) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const target = e.target as Element | null;
        const finalTarget =
            target && !target.hasAttribute("data-macro-ignore") &&
                !target.closest("[data-macro-ignore]")
                ? target
                : null;

        this.finish(finalTarget);
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.cancel();
        }
    }

    private removeHoverOverlay(): void {
        if (this.hoverOverlay && this.hoverOverlay.parentNode) {
            this.hoverOverlay.parentNode.removeChild(this.hoverOverlay);
            this.hoverOverlay = null;
        }
    }

    private finish(result: Element | null): void {
        this.removeHoverOverlay();
        window.removeEventListener("mousemove", this.boundOnMouseMove, true);
        window.removeEventListener("click", this.boundOnClick, true);
        window.removeEventListener("keydown", this.boundOnKeyDown, true);
        this.isActive = false;

        if (this.resolvePromise) {
            this.resolvePromise(result);
            this.resolvePromise = null;
        }
    }

    public cancel(): void {
        this.finish(null);
    }
}
