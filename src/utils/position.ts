export type OverlayPosition =
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right";

export function getPositionStyles(
    position: OverlayPosition,
): Partial<CSSStyleDeclaration> {
    const styles: Partial<CSSStyleDeclaration> = {
        display: "flex",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        pointerEvents: "none",
        boxSizing: "border-box",
        margin: "0",
        padding: "0",
    };

    switch (position) {
        case "right":
            styles.justifyContent = "flex-end";
            styles.alignItems = "stretch"; // Flush full vertical height
            break;

        case "left":
            styles.justifyContent = "flex-start";
            styles.alignItems = "stretch"; // Flush full vertical height
            break;

        case "center":
            styles.justifyContent = "center";
            styles.alignItems = "center";
            styles.padding = "20px";
            break;

        case "top":
            styles.justifyContent = "center";
            styles.alignItems = "flex-start";
            styles.padding = "16px";
            break;

        case "bottom":
            styles.justifyContent = "center";
            styles.alignItems = "flex-end";
            styles.padding = "16px";
            break;
    }

    return styles;
}
