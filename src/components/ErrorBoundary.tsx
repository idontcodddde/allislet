import { Component, ComponentChildren, h } from "preact";

interface ErrorBoundaryProps {
    children: ComponentChildren;
    fallback?: (error: Error, reset: () => void) => ComponentChildren;
    onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    public componentDidCatch(error: Error): void {
        this.setState({ hasError: true, error });
        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleReset);
            }

            return (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#181825",
                        border: "1px solid #f38ba8",
                        borderRadius: "8px",
                        color: "#cdd6f4",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        margin: "8px",
                    }}
                >
                    <div style={{ color: "#f38ba8", fontWeight: "bold", marginBottom: "8px" }}>
                        ⚠️ Component Render Error
                    </div>
                    <div style={{ backgroundColor: "#11111b", padding: "8px", borderRadius: "4px", marginBottom: "12px", whiteSpace: "pre-wrap" }}>
                        {this.state.error.message}
                    </div>
                    <button
                        onClick={this.handleReset}
                        style={{
                            backgroundColor: "#313244",
                            color: "#cdd6f4",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}