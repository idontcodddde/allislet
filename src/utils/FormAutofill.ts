export class FormAutofill {
    /**
     * Automatically populates complex host page forms from a key-value data map.
     */
    public static fill(
        formSelector: string | HTMLFormElement,
        dataMap: Record<string, string | boolean | number>,
    ): void {
        const form = typeof formSelector === "string"
            ? document.querySelector<HTMLFormElement>(formSelector)
            : formSelector;

        if (!form) {
            console.warn(
                `[FormAutofill] Target form not found: ${formSelector}`,
            );
            return;
        }

        Object.entries(dataMap).forEach(([fieldKey, value]) => {
            const field = form.querySelector<HTMLElement>(
                `[name="${CSS.escape(fieldKey)}"], #${
                    CSS.escape(fieldKey)
                }, [data-testid="${CSS.escape(fieldKey)}"]`,
            );

            if (!field) return;

            if (field instanceof HTMLInputElement) {
                if (field.type === "checkbox" || field.type === "radio") {
                    field.checked = Boolean(value);
                    field.dispatchEvent(
                        new Event("change", { bubbles: true, composed: true }),
                    );
                    field.dispatchEvent(
                        new Event("click", { bubbles: true, composed: true }),
                    );
                } else {
                    FormAutofill.setNativeValue(field, String(value));
                }
            } else if (field instanceof HTMLTextAreaElement) {
                FormAutofill.setNativeValue(field, String(value));
            } else if (field instanceof HTMLSelectElement) {
                field.value = String(value);
                field.dispatchEvent(
                    new Event("change", { bubbles: true, composed: true }),
                );
            }
        });
    }

    private static setNativeValue(
        element: HTMLInputElement | HTMLTextAreaElement,
        value: string,
    ): void {
        const prototype = Object.getPrototypeOf(element);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
        if (descriptor && descriptor.set) {
            descriptor.set.call(element, value);
        } else {
            element.value = value;
        }

        element.dispatchEvent(
            new Event("input", { bubbles: true, composed: true }),
        );
        element.dispatchEvent(
            new Event("change", { bubbles: true, composed: true }),
        );
    }
}
