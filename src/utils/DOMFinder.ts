export class DOMFinder {
    /**
     * Searches for host elements matching inner text strings (case-insensitive substring match).
     */
    public static byText(
        text: string,
        container: Element | Document = document,
    ): Element[] {
        const searchText = text.trim().toLowerCase();
        const results: Element[] = [];
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node: Element) => {
                    if (
                        node.hasAttribute("data-macro-ignore") ||
                        node.closest("[data-macro-ignore]")
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    const hasDirectMatchingText = Array.from(node.childNodes)
                        .some(
                            (child) =>
                                child.nodeType === Node.TEXT_NODE &&
                                child.textContent?.toLowerCase().includes(
                                    searchText,
                                ),
                        );
                    return hasDirectMatchingText
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                },
            },
        );

        let currentNode = walker.nextNode();
        while (currentNode) {
            results.push(currentNode as Element);
            currentNode = walker.nextNode();
        }

        return results;
    }

    /**
     * Evaluates XPath queries on host DOM and returns matching nodes.
     */
    public static byXPath(
        xpathExpression: string,
        root: Node = document,
    ): Element[] {
        const results: Element[] = [];
        try {
            const evaluation = document.evaluate(
                xpathExpression,
                root,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
            );

            for (let i = 0; i < evaluation.snapshotLength; i++) {
                const node = evaluation.snapshotItem(i);
                if (node instanceof Element) {
                    results.push(node);
                }
            }
        } catch (err) {
            console.warn(
                `[DOMFinder] Invalid XPath expression: ${xpathExpression}`,
                err,
            );
        }
        return results;
    }
}
