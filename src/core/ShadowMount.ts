export interface ShadowMountHandle {
    host: HTMLElement;
    root: ShadowRoot;
    destroy(): void;
}

export class HostReset {
    public static apply(host: HTMLElement): void {
        host.style.cssText = "";
        Object.assign(host.style, {
            position: "fixed",
            zIndex: "2147483647",
            pointerEvents: "none",
        });
    }

    public static injectBaseStyles(root: ShadowRoot, ownerDocument: Document): void {
        const style = ownerDocument.createElement("style");
        style.textContent = `
            :host {
                all: initial;
                pointer-events: none !important;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }

            *, *::before, *::after {
                box-sizing: border-box;
            }

            #allislet-render-target {
                display: contents !important;
            }

            [data-window-container] {
                pointer-events: auto !important;
            }
        `;
        root.appendChild(style);
    }
}

export class ShadowMount {
    public static create(
        id: string,
        positionStyles: Partial<CSSStyleDeclaration>,
        options: { document?: Document; parent?: Node } = {},
    ): ShadowMountHandle {
        const ownerDocument = options.document || document;
        const host = ownerDocument.createElement("div");
        host.id = id;
        HostReset.apply(host);
        Object.assign(host.style, positionStyles);
        (options.parent || ownerDocument.body).appendChild(host);

        const root = host.attachShadow({ mode: "closed" });
        HostReset.injectBaseStyles(root, ownerDocument);

        return {
            host,
            root,
            destroy: () => host.remove(),
        };
    }
}
