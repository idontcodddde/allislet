import { ComponentChild } from 'preact';
export type TeleportPosition = "append" | "prepend" | "replace";
export interface TeleportResult {
    container: HTMLDivElement;
    unmount: () => void;
}
/**
 * Imperative helper function.
 */
export declare function teleport(component: ComponentChild, targetSelector: string | Element, position?: TeleportPosition): TeleportResult | null;
export interface TeleportProps {
    children?: ComponentChild;
    component?: ComponentChild;
    targetSelector: string | Element;
    position?: TeleportPosition;
}
/**
 * Declarative TSX Component wrapper.
 */
export declare function Teleport({ children, component, targetSelector, position }: TeleportProps): null;
