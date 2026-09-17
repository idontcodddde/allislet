export declare class FormAutofill {
    /**
     * Automatically populates complex host page forms from a key-value data map.
     */
    static fill(formSelector: string | HTMLFormElement, dataMap: Record<string, string | boolean | number>): void;
    private static setNativeValue;
}
