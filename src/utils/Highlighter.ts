import { DOMUtils } from "./DOMutils";

export class Highlighter {
    private static activeOverlays: HTMLElement[] = [];

    /**
     * Draws a non-destructive visual overlay box over target DOM element.
     */
    public static outline(
        node: Element,
        customStyle: Partial<CSSStyleDeclaration> = {},
    ): HTMLElement {
        const bounds = DOMUtils.getAbsoluteBounds(node);
        const overlay = document.createElement("div");

        overlay.setAttribute("data-macro-ignore", "true");
        overlay.className = "allislet-highlighter-overlay";

        const defaultStyle: Partial<CSSStyleDeclaration> = {
            position: "absolute",
            top: `${bounds.top}px`,
            left: `${bounds.left}px`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
            border: "2px solid #5865f2",
            backgroundColor: "rgba(88, 101, 242, 0.15)",
            pointerEvents: "none",
            zIndex: "2147483647",
            boxSizing: "border-box",
            transition: "all 0.05s ease-out",
            ...customStyle,
        };

        Object.assign(overlay.style, defaultStyle);
        document.body.appendChild(overlay);
        Highlighter.activeOverlays.push(overlay);

        return overlay;
    }

    /**
     * Removes all active highlight overlays from the page.
     */
    public static clearAll(): void {
        Highlighter.activeOverlays.forEach((overlay) => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        Highlighter.activeOverlays = [];
    }
}
