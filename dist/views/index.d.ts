import { ComponentType } from 'preact';
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
export declare const registeredViews: RegisteredView[];
