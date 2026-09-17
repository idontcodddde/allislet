export declare class DOMFinder {
    /**
     * Searches for host elements matching inner text strings (case-insensitive substring match).
     */
    static byText(text: string, container?: Element | Document): Element[];
    /**
     * Evaluates XPath queries on host DOM and returns matching nodes.
     */
    static byXPath(xpathExpression: string, root?: Node): Element[];
}
