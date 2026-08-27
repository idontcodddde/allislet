export class Theme {
    private static rootContainer: HTMLElement | null = null;

    public static setRootContainer(container: HTMLElement): void {
        Theme.rootContainer = container;
    }

    /**
     * Dynamically updates CSS variable accent colors in the Shadow DOM host.
     */
    public static setAccentColor(hex: string): void {
        const target = Theme.rootContainer || document.documentElement;
        target.style.setProperty("--allislet-accent", hex);
        target.style.setProperty("--allislet-accent-hover", `${hex}cc`);
    }

    /**
     * Switches the root UI theme mode ('dark' | 'light').
     */
    public static toggleMode(mode: "dark" | "light"): void {
        const target = Theme.rootContainer || document.documentElement;
        target.setAttribute("data-theme", mode);
    }
}
