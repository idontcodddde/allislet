import { ComponentType } from 'preact';
interface ViewItem {
    id: string;
    name?: string;
    label?: string;
    icon?: string;
    Component: ComponentType<Record<string, never>>;
}
interface SidebarProps {
    views: ViewItem[];
    activeTab: string;
    onSelectTab: (id: string) => void;
    accentColor: string;
    initiallyCollapsed?: boolean;
    onToggle?: () => void;
}
export declare function Sidebar({ views, activeTab, onSelectTab, accentColor, initiallyCollapsed, onToggle }: SidebarProps): import("preact").JSX.Element;
export {};
