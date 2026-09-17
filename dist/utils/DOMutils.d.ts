export interface AbsoluteBounds {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}
export declare class DOMUtils {
    /**
     * Traverses up the DOM tree from node until a parent matching selector is found.
     */
    static parentsUntil(node: Element, selector: string): Element[];
    /**
     * Calculates exact absolute pixel dimensions and scroll offsets for a node.
     */
    static getAbsoluteBounds(node: Element): AbsoluteBounds;
}
