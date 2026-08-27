export class Sanitizer {
    /**
     * Sanitizes raw HTML strings before injecting them into UI components.
     */
    public static cleanHTML(rawHtml: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");

        const dangerousTags = doc.querySelectorAll(
            "script, iframe, object, embed, style",
        );
        dangerousTags.forEach((tag) => tag.remove());

        const allElements = doc.querySelectorAll("*");
        allElements.forEach((el) => {
            const attributes = Array.from(el.attributes);
            attributes.forEach((attr) => {
                if (attr.name.startsWith("on")) {
                    el.removeAttribute(attr.name);
                }
                if (
                    (attr.name === "href" || attr.name === "src" ||
                        attr.name === "action") &&
                    attr.value.trim().toLowerCase().startsWith("javascript:")
                ) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        return doc.body.innerHTML;
    }
}
