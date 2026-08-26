export type ThemeMode = "dark" | "light";

export type OverlayPosition =
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right";

export interface ThemeConfig {
    mode?: ThemeMode;
    accentColor?: string;
    defaultDockPosition?: OverlayPosition;
}
