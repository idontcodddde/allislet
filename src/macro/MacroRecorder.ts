export type MacroActionType = "click" | "input" | "scroll";

export interface MacroAction {
    type: MacroActionType;
    selector: string;
    timestamp: number;
    delay: number;
    value?: string;
    scrollX?: number;
    scrollY?: number;
}

export interface PlayOptions {
    speed?: number; // Speed multiplier (e.g., 1 = 1x, 2 = 2x, 0.5 = 0.5x)
    onStep?: (action: MacroAction, index: number) => void;
}

/**
 * Traverses both light DOM and open Shadow DOM trees to locate elements.
 */
function querySelectorDeep(
    selector: string,
    root: ParentNode = document,
): Element | null {
    const found = root.querySelector(selector);
    if (found) return found;

    const elements = root.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
        const shadow = elements[i].shadowRoot;
        if (shadow) {
            const innerFound = querySelectorDeep(selector, shadow);
            if (innerFound) return innerFound;
        }
    }
    return null;
}

/**
 * Safely extracts event targets across shadow boundaries with explicit array typing.
 */
function getEventPath(e: Event): EventTarget[] {
    if (typeof e.composedPath === "function") {
        return e.composedPath() as EventTarget[];
    }
    const target = e.target;
    return target ? [target] : [];
}

/**
 * Builds a CSS selector path, bypassing host bookmarklet containers and shadow roots.
 */
function getUniqueSelectorFromPath(
    composedPath: (EventTarget | null | undefined)[],
): string {
    const path: string[] = [];

    for (const node of composedPath) {
        if (!(node instanceof Element)) continue;
        if (node === document.body || node === document.documentElement) break;

        // Ignore bookmarklet host wrapper IDs so selectors don't collapse into #my-custom-bookmarklet
        if (
            node.id &&
            node.id !== "my-custom-bookmarklet" &&
            !node.id.startsWith("allislet")
        ) {
            path.unshift(`#${CSS.escape(node.id)}`);
            break;
        }

        let selector = node.tagName.toLowerCase();

        if (node.className && typeof node.className === "string") {
            const classes = node.className
                .trim()
                .split(/\s+/)
                .filter((c) => c && !c.startsWith("allislet"))
                .map((c) => `.${CSS.escape(c)}`)
                .join("");
            if (classes) selector += classes;
        }

        const parentNode = node.parentElement;
        if (parentNode) {
            const currentTag = node.tagName;
            const siblings = Array.from(parentNode.children).filter(
                (child) => child.tagName === currentTag,
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(node) + 1;
                selector += `:nth-of-type(${index})`;
            }
        }

        path.unshift(selector);
    }

    return path.join(" > ") || "element";
}

export class MacroRecorder {
    private isRecording = false;
    private isPlaying = false;
    private actions: MacroAction[] = [];
    private startTime = 0;
    private lastEventTime = 0;
    private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    private boundOnClick: (e: MouseEvent) => void;
    private boundOnInput: (e: Event) => void;
    private boundOnScroll: (e: Event) => void;

    constructor() {
        this.boundOnClick = this.handleClick.bind(this);
        this.boundOnInput = this.handleInput.bind(this);
        this.boundOnScroll = this.handleScroll.bind(this);
    }

    public start(): void {
        if (this.isRecording) return;
        this.isRecording = true;
        this.actions = [];
        this.startTime = Date.now();
        this.lastEventTime = this.startTime;

        window.addEventListener("click", this.boundOnClick, true);
        window.addEventListener("input", this.boundOnInput, true);
        window.addEventListener("scroll", this.boundOnScroll, true);
    }

    public stop(): MacroAction[] {
        if (!this.isRecording) return [...this.actions];
        this.isRecording = false;

        window.removeEventListener("click", this.boundOnClick, true);
        window.removeEventListener("input", this.boundOnInput, true);
        window.removeEventListener("scroll", this.boundOnScroll, true);

        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

        return [...this.actions];
    }

    private recordAction(
        type: MacroActionType,
        composedPath: (EventTarget | null | undefined)[],
        extra: Partial<MacroAction> = {},
    ): void {
        const now = Date.now();
        const delay = now - this.lastEventTime;
        this.lastEventTime = now;

        const action: MacroAction = {
            type,
            selector: getUniqueSelectorFromPath(composedPath),
            timestamp: now - this.startTime,
            delay,
            ...extra,
        };

        this.actions.push(action);
    }

    private handleClick(e: MouseEvent): void {
        if (!this.isRecording) return;
        const path = getEventPath(e);
        if (path.length > 0) {
            this.recordAction("click", path);
        }
    }

    private handleInput(e: Event): void {
        if (!this.isRecording) return;
        const path = getEventPath(e);
        const target = path[0] as Element | undefined;

        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement
        ) {
            this.recordAction("input", path, { value: target.value });
        }
    }

    private handleScroll(e: Event): void {
        if (!this.isRecording) return;

        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            const path = getEventPath(e);
            const rawTarget = path[0];
            const target = rawTarget === document || rawTarget === window
                ? document.documentElement
                : (rawTarget as Element);

            if (target instanceof Element) {
                this.recordAction("scroll", path, {
                    scrollX: target === document.documentElement
                        ? window.scrollX
                        : target.scrollLeft,
                    scrollY: target === document.documentElement
                        ? window.scrollY
                        : target.scrollTop,
                });
            }
        }, 100);
    }

    public async play(
        actions: MacroAction[],
        options: PlayOptions = {},
    ): Promise<void> {
        if (this.isPlaying) return;
        this.isPlaying = true;
        const speed = options.speed && options.speed > 0 ? options.speed : 1;

        for (let i = 0; i < actions.length; i++) {
            if (!this.isPlaying) break;
            const action = actions[i];

            const scaledDelay = (action.delay || 0) / speed;
            if (scaledDelay > 0) {
                await new Promise((res) => setTimeout(res, scaledDelay));
            }

            // Query across shadow boundaries
            const target = querySelectorDeep(action.selector);
            if (!target) {
                console.warn(
                    `[MacroRecorder] Target not found: ${action.selector}`,
                );
                options.onStep?.(action, i);
                continue;
            }

            if (action.type === "click") {
                if (typeof (target as HTMLElement).click === "function") {
                    (target as HTMLElement).click();
                }
                target.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        view: window,
                    }),
                );
            } else if (action.type === "input") {
                if (
                    target instanceof HTMLInputElement ||
                    target instanceof HTMLTextAreaElement ||
                    target instanceof HTMLSelectElement
                ) {
                    target.value = action.value ?? "";
                    target.dispatchEvent(
                        new Event("input", { bubbles: true, composed: true }),
                    );
                    target.dispatchEvent(
                        new Event("change", { bubbles: true, composed: true }),
                    );
                }
            } else if (action.type === "scroll") {
                if (
                    target === document.documentElement ||
                    target === document.body
                ) {
                    window.scrollTo({
                        left: action.scrollX ?? 0,
                        top: action.scrollY ?? 0,
                        behavior: "smooth",
                    });
                } else {
                    target.scrollTo({
                        left: action.scrollX ?? 0,
                        top: action.scrollY ?? 0,
                        behavior: "smooth",
                    });
                }
            }

            options.onStep?.(action, i);
        }

        this.isPlaying = false;
    }

    public stopPlayback(): void {
        this.isPlaying = false;
    }
}
