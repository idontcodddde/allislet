import { Component, ComponentChildren } from 'preact';
interface ErrorBoundaryProps {
    children: ComponentChildren;
    fallback?: (error: Error, reset: () => void) => ComponentChildren;
    onError?: (error: Error) => void;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    componentDidCatch(error: Error): void;
    private handleReset;
    render(): ComponentChildren;
}
export {};
