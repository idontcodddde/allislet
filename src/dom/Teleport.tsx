import { render, ComponentChild } from "preact";
import { useEffect } from "preact/hooks";

export type TeleportPosition = "append" | "prepend" | "replace";

export interface TeleportResult {
    container: HTMLDivElement;
    unmount: () => void;
}

/**
 * Imperative helper function.
 */
export function teleport(
    component: ComponentChild,
    targetSelector: string | Element,
    position: TeleportPosition = "append"
): TeleportResult | null {
    const targetEl =
        typeof targetSelector === "string"
            ? document.querySelector(targetSelector)
            : targetSelector;

    if (!targetEl) {
        console.warn(`[Allislet Teleport] Target element not found:`, targetSelector);
        return null;
    }

    const container = document.createElement("div");
    container.setAttribute("data-allislet-teleport", "true");
    container.style.display = "contents";

    if (position === "append") {
        targetEl.appendChild(container);
    } else if (position === "prepend") {
        targetEl.insertBefore(container, targetEl.firstChild);
    } else if (position === "replace") {
        targetEl.innerHTML = "";
        targetEl.appendChild(container);
    }

    render(component, container);

    const unmount = () => {
        render(null, container);
        container.remove();
    };

    return { container, unmount };
}

export interface TeleportProps {
    children?: ComponentChild;
    component?: ComponentChild;
    targetSelector: string | Element;
    position?: TeleportPosition;
}

/**
 * Declarative TSX Component wrapper.
 */
export function Teleport({ children, component, targetSelector, position = "append" }: TeleportProps) {
    useEffect(() => {
        const node = component || children;
        if (!node) return;

        const res = teleport(node, targetSelector, position);
        return () => res?.unmount();
    }, [targetSelector, position, children, component]);

    return null;
}