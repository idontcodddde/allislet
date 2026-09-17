import { ComponentChildren } from 'preact';
interface ModalItem {
    id: string;
    component: ComponentChildren;
}
type ModalListener = (stack: ModalItem[]) => void;
export declare class Modal {
    private static stack;
    private static listeners;
    static subscribe(listener: ModalListener): () => void;
    /**
     * Imperatively opens a modal overlay over the bookmarklet interface.
     */
    static open(component: ComponentChildren): string;
    /**
     * Closes the top-most active modal overlay.
     */
    static close(): void;
    private static notify;
}
export declare function ModalContainer(): import("preact").JSX.Element | null;
export {};
