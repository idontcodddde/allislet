import { h, ComponentChildren } from 'preact';
export interface ToastOptions {
    duration?: number;
    icon?: ComponentChildren;
}
export declare function ToastContainer(): h.JSX.Element;
export declare class Toast {
    private static add;
    static dismiss(id: string): void;
    static success(message: string, opts?: ToastOptions): string;
    static error(message: string, opts?: ToastOptions): string;
    static info(message: string, opts?: ToastOptions): string;
    static custom(component: ComponentChildren, opts?: ToastOptions): string;
}
