export declare class Theme {
    private static rootContainer;
    static setRootContainer(container: HTMLElement): void;
    /**
     * Dynamically updates CSS variable accent colors in the Shadow DOM host.
     */
    static setAccentColor(hex: string): void;
    /**
     * Switches the root UI theme mode ('dark' | 'light').
     */
    static toggleMode(mode: "dark" | "light"): void;
}
