import { ComponentChildren } from "preact";

export interface WindowView {
    id: string;
    label: string;
    icon?: string;
    component: ComponentChildren;
}

export interface WindowConfig {
    id: string;
    title: string;
    type?: "component" | "sidebar";
    persistentSidebar?: boolean;
    component?: ComponentChildren;
    views?: WindowView[];
    draggable?: boolean;
    width?: number | string;
    height?: number | string;
}
