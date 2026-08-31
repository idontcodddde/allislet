import { ComponentChildren, h, render } from "preact";
import { useState } from "preact/hooks";
import { Signal, signal } from "@preact/signals";
import { useSignalValue } from "../hooks/useSignalValue";
import { Icon } from "../components/Icon";

export interface WindowView {
    id: string;
    label: string;
    icon?: string;
    component: ComponentChildren;
}

export interface WindowConfig {
    id: string;
    title: string;
    type?: "component" | "sidebar";
    component?: ComponentChildren;
    views?: WindowView[];
    draggable?: boolean;
    width?: number | string;
    height?: number | string;
    persistentSidebar?: boolean;
    activeTabSignal?: Signal<string>;
}

interface ManagedWindow {
    element: HTMLElement;
    config: WindowConfig;
    x: number;
    y: number;
}

export class WindowManager {
    private hostElement: HTMLElement | null = null;
    private shadowRoot: ShadowRoot | null = null;
    private activeWindows: Map<string, ManagedWindow> = new Map();
    private persistentTabSignals: Map<string, Signal<string>> = new Map();

    /**
     * Creates or retrieves a persistent Signal for a specific windowId,
     * backed by localStorage so state survives browser refreshes.
     */
    public getTabSignal(windowId: string, defaultTab: string): Signal<string> {
        if (!this.persistentTabSignals.has(windowId)) {
            const storageKey = `allislet_win_tab_${windowId}`;
            let initialTab = defaultTab;

            try {
                const stored = localStorage.getItem(storageKey);
                if (stored) initialTab = stored;
            } catch (_) {}

            const tabSignal = signal<string>(initialTab);

            // Persist changes to localStorage per windowId
            tabSignal.subscribe((val) => {
                try {
                    if (val) localStorage.setItem(storageKey, val);
                } catch (_) {}
            });

            this.persistentTabSignals.set(windowId, tabSignal);
        }

        return this.persistentTabSignals.get(windowId)!;
    }

    /**
     * Attaches host elements and root drag listener for the main application window.
     */
    public attach(hostElement: HTMLElement, shadowRoot: ShadowRoot): void {
        this.hostElement = hostElement;
        this.shadowRoot = shadowRoot;

        // Delegated pointerdown listener for main app window inside Shadow DOM
        shadowRoot.addEventListener("pointerdown", this.handleMainPointerDown);
    }

    private handleMainPointerDown = (evt: Event): void => {
        const e = evt as PointerEvent;
        const path = e.composedPath();

        const isManagedWindow = path.some(
            (el) =>
                el instanceof HTMLElement && el.id &&
                el.id.startsWith("allislet-window-"),
        );
        if (isManagedWindow) return;

        this.focusMainWindow();

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

        const targetContainer = (path.find(
            (el) =>
                el instanceof HTMLElement &&
                el.hasAttribute("data-window-container"),
        ) as HTMLElement | undefined) ||
            this.shadowRoot?.querySelector<HTMLElement>(
                "[data-main-window], [data-window-container]",
            );

        if (!targetContainer) return;

        e.stopPropagation();

        const { x, y } = this.getTranslation(targetContainer);
        let currentX = x;
        let currentY = y;
        const startX = e.clientX - currentX;
        const startY = e.clientY - currentY;

        dragHandle.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        const handlePointerMove = (moveEvt: PointerEvent) => {
            currentX = moveEvt.clientX - startX;
            currentY = moveEvt.clientY - startY;
            targetContainer.style.transform =
                `translate3d(${currentX}px, ${currentY}px, 0px)`;
        };

        const handlePointerUp = () => {
            dragHandle.style.cursor = "grab";
            document.body.style.userSelect = "";
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
    };

    public resetPosition(id?: string): void {
        if (id) {
            const entry = this.activeWindows.get(id);
            if (entry) {
                entry.x = 0;
                entry.y = 0;
                entry.element.style.transform = "";
            }
        } else {
            const mainContainer = this.shadowRoot?.querySelector<HTMLElement>(
                "[data-main-window], [data-window-container]",
            );
            if (mainContainer) {
                mainContainer.style.transform = "";
            }

            this.activeWindows.forEach((win) => {
                win.x = 0;
                win.y = 0;
                win.element.style.transform = "";
            });
        }
    }

    private getTranslation(element: HTMLElement): { x: number; y: number } {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        if (!transform || transform === "none") return { x: 0, y: 0 };

        try {
            const MatrixClass = (window as any).DOMMatrix ||
                (window as any).WebKitCSSMatrix ||
                (window as any).MSCSSMatrix;

            if (MatrixClass) {
                const matrix = new MatrixClass(transform);
                return { x: matrix.m41 || 0, y: matrix.m42 || 0 };
            }
        } catch (_) {}
        return { x: 0, y: 0 };
    }

    public openWindow(config: WindowConfig): void {
        if (this.activeWindows.has(config.id)) {
            this.focusWindow(config.id);
            return;
        }

        const windowEl = document.createElement("div");
        windowEl.id = `allislet-window-${config.id}`;
        windowEl.setAttribute("data-window-container", "true");
        windowEl.setAttribute("data-macro-ignore", "true");

        Object.assign(windowEl.style, {
            position: "fixed",
            top: "120px",
            left: "120px",
            width: typeof config.width === "number"
                ? `${config.width}px`
                : config.width || "520px",
            height: typeof config.height === "number"
                ? `${config.height}px`
                : config.height || "420px",
            backgroundColor: "#1e1f22",
            border: "1px solid #2b2d31",
            borderRadius: "8px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            zIndex: `${Date.now().toString().slice(-8)}`,
            overflow: "hidden",
            pointerEvents: "auto",
        });

        const stopBleedThrough = (e: Event) => e.stopPropagation();
        windowEl.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            this.focusWindow(config.id);
        });
        windowEl.addEventListener("mousedown", stopBleedThrough);
        windowEl.addEventListener("click", stopBleedThrough);

        const managedWin: ManagedWindow = {
            element: windowEl,
            config,
            x: 0,
            y: 0,
        };

        const mountParent = this.shadowRoot
            ? (this.shadowRoot as unknown as HTMLElement)
            : document.body;
        mountParent.appendChild(windowEl);

        render(
            h(WindowRenderer, {
                config,
                managedWin,
                onClose: () => this.closeWindow(config.id),
                onFocus: () => this.focusWindow(config.id),
            }),
            windowEl,
        );

        this.activeWindows.set(config.id, managedWin);
    }

    public closeWindow(id: string): void {
        const entry = this.activeWindows.get(id);
        if (!entry) return;

        render(null, entry.element);
        entry.element.remove();
        this.activeWindows.delete(id);
    }

    public focusWindow(id: string): void {
        const entry = this.activeWindows.get(id);
        if (entry) {
            entry.element.style.zIndex = `${Date.now().toString().slice(-8)}`;
        }
    }

    public focusMainWindow(): void {
        if (!this.shadowRoot) return;

        const mainWin =
            this.shadowRoot.querySelector<HTMLElement>("[data-main-window]") ||
            this.shadowRoot.querySelector<HTMLElement>(
                "[data-window-container]",
            ) ||
            this.shadowRoot.querySelector<HTMLElement>(
                "#allislet-render-target > div",
            );

        if (mainWin) {
            if (
                !mainWin.style.position || mainWin.style.position === "static"
            ) {
                mainWin.style.position = "relative";
            }
            mainWin.style.zIndex = `${Date.now().toString().slice(-8)}`;
        }
    }
}

export const windowManager = new WindowManager();

function WindowRenderer({
    config,
    managedWin,
    onClose,
    onFocus,
}: {
    config: WindowConfig;
    managedWin: ManagedWindow;
    onClose: () => void;
    onFocus: () => void;
}) {
    const initialTab = config.views && config.views.length > 0
        ? config.views[0].id
        : "";

    // Resolve isolated persistent Signal per window ID or fallback to local state
    const activeTabSignal = config.persistentSidebar
        ? (config.activeTabSignal ||
            windowManager.getTabSignal(config.id, initialTab))
        : null;

    const localState = useState<string>(initialTab);
    const signalTab = activeTabSignal ? useSignalValue(activeTabSignal) : null;

    const rawTabId = activeTabSignal
        ? (signalTab || initialTab)
        : localState[0];

    // Ensure tab ID is valid for current views array
    const currentTabId = config.views?.some((v) => v.id === rawTabId)
        ? rawTabId
        : initialTab;

    const setActiveTab = (tabId: string) => {
        if (activeTabSignal) {
            activeTabSignal.value = tabId;
        } else {
            localState[1](tabId);
        }
    };

    const isDraggable = config.draggable !== false;
    const activeView = config.views?.find((v) => v.id === currentTabId) ||
        config.views?.[0];

    const handleHeaderPointerDown = (e: PointerEvent) => {
        onFocus();

        const target = e.target as HTMLElement | null;
        if (
            target && target.closest("button, input, textarea, [data-no-drag]")
        ) {
            return;
        }

        if (!isDraggable) return;

        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX - managedWin.x;
        const startY = e.clientY - managedWin.y;
        const headerEl = e.currentTarget as HTMLElement;

        headerEl.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        const handlePointerMove = (moveEvt: PointerEvent) => {
            managedWin.x = moveEvt.clientX - startX;
            managedWin.y = moveEvt.clientY - startY;
            managedWin.element.style.transform =
                `translate3d(${managedWin.x}px, ${managedWin.y}px, 0px)`;
        };

        const handlePointerUp = () => {
            headerEl.style.cursor = "grab";
            document.body.style.userSelect = "";
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
    };

    return h(
        "div",
        {
            style: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                color: "#dbdee1",
            },
        },
        h(
            "div",
            {
                onPointerDown: handleHeaderPointerDown,
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "#111214",
                    borderBottom: "1px solid #2b2d31",
                    userSelect: "none",
                    cursor: isDraggable ? "grab" : "default",
                },
            },
            h(
                "span",
                { style: { fontWeight: 600, fontSize: "13px" } },
                config.title,
            ),
            h(
                "button",
                {
                    "data-no-drag": "true",
                    onPointerDown: (e: Event) => e.stopPropagation(),
                    onClick: (e: Event) => {
                        e.stopPropagation();
                        onClose();
                    },
                    style: {
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#b5bac1",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: 1,
                        padding: "4px 8px",
                        borderRadius: "4px",
                    },
                },
                "✕",
            ),
        ),
        h(
            "div",
            { style: { display: "flex", flex: 1, overflow: "hidden" } },
            config.type === "sidebar" && config.views && config.views.length > 0
                ? [
                    h(
                        "div",
                        {
                            style: {
                                width: "140px",
                                backgroundColor: "#18191c",
                                borderRight: "1px solid #2b2d31",
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 4px",
                                gap: "4px",
                            },
                        },
                        config.views.map((v) =>
                            h(
                                "button",
                                {
                                    key: v.id,
                                    "data-no-drag": "true",
                                    onPointerDown: (e: Event) =>
                                        e.stopPropagation(),
                                    onClick: (e: Event) => {
                                        e.stopPropagation();
                                        setActiveTab(v.id);
                                    },
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "6px 8px",
                                        borderRadius: "4px",
                                        border: "none",
                                        backgroundColor: currentTabId === v.id
                                            ? "#2b2d31"
                                            : "transparent",
                                        color: currentTabId === v.id
                                            ? "#fff"
                                            : "#949ba4",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        width: "100%",
                                    },
                                },
                                v.icon
                                    ? h(Icon, { icon: v.icon, size: "14px" })
                                    : null,
                                v.label,
                            )
                        ),
                    ),
                    h(
                        "div",
                        {
                            style: {
                                flex: 1,
                                overflowY: "auto",
                                padding: "12px",
                            },
                        },
                        activeView?.component,
                    ),
                ]
                : h(
                    "div",
                    { style: { flex: 1, overflowY: "auto", padding: "12px" } },
                    config.component,
                ),
        ),
    );
}
