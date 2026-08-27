export interface AbsoluteBounds {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}

export class DOMUtils {
    /**
     * Traverses up the DOM tree from node until a parent matching selector is found.
     */
    public static parentsUntil(node: Element, selector: string): Element[] {
        const parents: Element[] = [];
        let current: Element | null = node.parentElement;

        while (current && current !== document.documentElement) {
            if (current.matches(selector)) {
                break;
            }
            parents.push(current);
            current = current.parentElement;
        }

        return parents;
    }

    /**
     * Calculates exact absolute pixel dimensions and scroll offsets for a node.
     */
    public static getAbsoluteBounds(node: Element): AbsoluteBounds {
        const rect = node.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        return {
            top: rect.top + scrollY,
            left: rect.left + scrollX,
            width: rect.width,
            height: rect.height,
            right: rect.right + scrollX,
            bottom: rect.bottom + scrollY,
        };
    }
}
