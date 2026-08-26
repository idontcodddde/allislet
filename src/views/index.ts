import { ComponentType } from "preact";

export interface ViewMeta {
    id: string;
    label: string;
    icon?: string;
    order?: number;
}

export interface ViewModule {
    default?: ComponentType<any>;
    meta?: Partial<ViewMeta>;
    [key: string]: any;
}

export interface RegisteredView {
    id: string;
    label: string;
    icon: string;
    order: number;
    Component: ComponentType<any>;
}

const viewModules = import.meta.glob<ViewModule>("./*.{tsx,ts,jsx,js}", {
    eager: true,
});

function formatLabel(filename: string): string {
    return filename
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
}

export const registeredViews: RegisteredView[] = Object.entries(viewModules)
    .filter(([path]) =>
        !path.endsWith("index.ts") && !path.endsWith("index.tsx")
    )
    .map(([path, mod]) => {
        const module = mod as ViewModule;
        const fileName =
            path.split("/").pop()?.replace(/\.(tsx|ts|jsx|js)$/, "") || "View";
        const generatedId = toKebabCase(fileName);

        const Component = module.default ||
            (Object.entries(module).find(
                ([key, val]) => key !== "meta" && typeof val === "function",
            )?.[1] as ComponentType<any>);

        return {
            id: module.meta?.id || generatedId,
            label: module.meta?.label || formatLabel(fileName),
            icon: module.meta?.icon || "⚡",
            order: module.meta?.order ?? 99,
            Component,
        };
    })
    .filter((view): view is RegisteredView => Boolean(view.Component))
    .sort((a, b) => a.order - b.order);
