import { render, h, ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";

export interface ToastOptions {
    duration?: number;
    icon?: ComponentChildren;
}

interface ToastItem {
    id: string;
    type: "success" | "error" | "info" | "custom";
    message?: string;
    customComponent?: ComponentChildren;
    duration: number;
    isExiting?: boolean;
}

let toastSubscribers: Array<(toasts: ToastItem[]) => void> = [];
let toastList: ToastItem[] = [];

function notifyToasts() {
    toastSubscribers.forEach((cb) => cb([...toastList]));
}

const toastStyles = `
@keyframes swal2-check-draw {
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
}
@keyframes swal2-x-draw {
  0% { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes toast-slide-in {
  0% {
    transform: translateX(calc(100% + 40px));
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes toast-slide-out {
  0% {
    transform: translateX(0);
    opacity: 1;
    max-height: 80px;
    margin-bottom: 0px;
  }
  100% {
    transform: translateX(calc(100% + 40px));
    opacity: 0;
    max-height: 0px;
    margin-bottom: -10px;
  }
}
.allislet-toast-enter {
  animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.allislet-toast-exit {
  animation: toast-slide-out 0.3s cubic-bezier(0.7, 0, 0.84, 0) forwards;
}
.allislet-toast-close:hover {
  color: #fff !important;
}
`;

function injectToastStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("allislet-toast-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "allislet-toast-styles";
    styleEl.textContent = toastStyles;
    document.head.appendChild(styleEl);
}

// Pre-inject animation styles at module load time
injectToastStyles();

function AnimatedSuccessIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
            <circle cx="26" cy="26" r="23" fill="none" stroke="#a6e3a1" strokeWidth="4" />
            <path
                fill="none"
                stroke="#a6e3a1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="50"
                strokeDashoffset="0"
                d="M14 27 l7 7 l17 -17"
                style={{ animation: "swal2-check-draw 0.4s ease-in-out forwards" }}
            />
        </svg>
    );
}

function AnimatedErrorIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 52 52" style={{ flexShrink: 0, animation: "swal2-x-draw 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
            <circle cx="26" cy="26" r="23" fill="none" stroke="#f38ba8" strokeWidth="4" />
            <path fill="none" stroke="#f38ba8" strokeWidth="4" strokeLinecap="round" d="M16 16 L36 36 M36 16 L16 36" />
        </svg>
    );
}

function AnimatedInfoIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 52 52" style={{ flexShrink: 0, animation: "swal2-x-draw 0.3s ease-out forwards" }}>
            <circle cx="26" cy="26" r="23" fill="none" stroke="#89b4fa" strokeWidth="4" />
            <circle cx="26" cy="16" r="3" fill="#89b4fa" />
            <path fill="none" stroke="#89b4fa" strokeWidth="4" strokeLinecap="round" d="M26 24 L26 38" />
        </svg>
    );
}

export function ToastContainer() {
    // Read current toast list directly on initial render
    const [toasts, setToasts] = useState<ToastItem[]>(() => [...toastList]);

    useEffect(() => {
        const handler = (newToasts: ToastItem[]) => setToasts(newToasts);
        toastSubscribers.push(handler);
        return () => {
            toastSubscribers = toastSubscribers.filter((cb) => cb !== handler);
        };
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                pointerEvents: "none",
                background: "transparent",
            }}
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={t.isExiting ? "allislet-toast-exit" : "allislet-toast-enter"}
                    style={{
                        pointerEvents: "auto",
                        backgroundColor: "#1e1e2e",
                        border: "1px solid #313244",
                        color: "#cdd6f4",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minWidth: "260px",
                        maxWidth: "400px",
                        fontSize: "13px",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        boxSizing: "border-box",
                    }}
                >
                    {t.type === "success" && <AnimatedSuccessIcon />}
                    {t.type === "error" && <AnimatedErrorIcon />}
                    {t.type === "info" && <AnimatedInfoIcon />}
                    {t.type === "custom" && t.customComponent}
                    {t.type !== "custom" && <span style={{ flex: 1 }}>{t.message}</span>}

                    <button
                        className="allislet-toast-close"
                        onClick={() => Toast.dismiss(t.id)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#6c7086",
                            cursor: "pointer",
                            padding: "2px",
                            marginLeft: "auto",
                            fontSize: "14px",
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

let isContainerMounted = false;
function ensureContainerMounted() {
    if (isContainerMounted) return;
    injectToastStyles();

    let containerEl = document.getElementById("allislet-toast-root");
    if (!containerEl) {
        containerEl = document.createElement("div");
        containerEl.id = "allislet-toast-root";
        Object.assign(containerEl.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "2147483647",
            pointerEvents: "none",
            background: "transparent",
            border: "none",
            boxShadow: "none",
            padding: "0",
            margin: "0",
            outline: "none",
        });
        document.body.appendChild(containerEl);
    }

    render(<ToastContainer />, containerEl);
    isContainerMounted = true;
}

export class Toast {
    private static add(item: Omit<ToastItem, "id">): string {
        const id = Math.random().toString(36).substring(2, 9);
        const fullItem: ToastItem = { ...item, id };
        toastList.push(fullItem);

        ensureContainerMounted();
        notifyToasts();

        if (item.duration > 0) {
            setTimeout(() => {
                Toast.dismiss(id);
            }, item.duration);
        }
        return id;
    }

    public static dismiss(id: string): void {
        const item = toastList.find((t) => t.id === id);
        if (!item || item.isExiting) return;

        item.isExiting = true;
        notifyToasts();

        setTimeout(() => {
            toastList = toastList.filter((t) => t.id !== id);
            notifyToasts();
        }, 300);
    }

    public static success(message: string, opts?: ToastOptions): string {
        return Toast.add({
            type: "success",
            message,
            duration: opts?.duration ?? 3500,
        });
    }

    public static error(message: string, opts?: ToastOptions): string {
        return Toast.add({
            type: "error",
            message,
            duration: opts?.duration ?? 4500,
        });
    }

    public static info(message: string, opts?: ToastOptions): string {
        return Toast.add({
            type: "info",
            message,
            duration: opts?.duration ?? 3500,
        });
    }

    public static custom(component: ComponentChildren, opts?: ToastOptions): string {
        return Toast.add({
            type: "custom",
            customComponent: component,
            duration: opts?.duration ?? 4000,
        });
    }
}