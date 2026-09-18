import { ComponentType } from "preact";
import { signal } from "@preact/signals";

export interface ViewMeta {
    id: string;
    label: string;
    icon?: string;
    order?: number;
}

export interface ViewModule {
    default?: ComponentType<Record<string, never>>;
    meta?: Partial<ViewMeta>;
    [key: string]: unknown;
}

export interface RegisteredView {
    id: string;
    label: string;
    icon: string;
    order: number;
    Component: ComponentType<Record<string, never>>;
}

export interface ViewDefinition {
    id: string;
    label: string;
    icon?: string;
    order?: number;
    Component: ComponentType<Record<string, never>>;
}

export const viewRegistryVersion = signal(0);

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

const builtInViews: RegisteredView[] = Object.entries(viewModules)
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
            )?.[1] as ComponentType<Record<string, never>>);

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

const customViews = new Map<string, RegisteredView>();

export const registeredViews: RegisteredView[] = builtInViews;

function notifyViewRegistry(): void {
    registeredViews.splice(
        0,
        registeredViews.length,
        ...builtInViews,
        ...customViews.values(),
    );
    registeredViews.sort((a, b) => a.order - b.order);
    viewRegistryVersion.value++;
}

export function registerView(view: ViewDefinition): () => void {
    customViews.set(view.id, {
        id: view.id,
        label: view.label,
        icon: view.icon || "⚡",
        order: view.order ?? 99,
        Component: view.Component,
    });
    notifyViewRegistry();
    return () => unregisterView(view.id);
}

export function unregisterView(id: string): boolean {
    const removed = customViews.delete(id);
    if (removed) notifyViewRegistry();
    return removed;
}

export function registerViews(views: readonly ViewDefinition[]): () => void {
    const unregister = views.map(registerView);
    return () => unregister.forEach((remove) => remove());
}

export function getRegisteredViews(): readonly RegisteredView[] {
    return registeredViews;
}
