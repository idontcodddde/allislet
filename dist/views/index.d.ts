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
export interface ViewDefinition {
    id: string;
    label: string;
    icon?: string;
    order?: number;
    Component: ComponentType<Record<string, never>>;
}
export declare const viewRegistryVersion: import('@preact/signals-core').Signal<number>;
export declare const registeredViews: RegisteredView[];
export declare function registerView(view: ViewDefinition): () => void;
export declare function unregisterView(id: string): boolean;
export declare function registerViews(views: readonly ViewDefinition[]): () => void;
export declare function getRegisteredViews(): readonly RegisteredView[];
