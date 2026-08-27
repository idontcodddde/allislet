import { ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";

interface ModalItem {
    id: string;
    component: ComponentChildren;
}

type ModalListener = (stack: ModalItem[]) => void;

export class Modal {
    private static stack: ModalItem[] = [];
    private static listeners: Set<ModalListener> = new Set();

    public static subscribe(listener: ModalListener): () => void {
        Modal.listeners.add(listener);
        listener([...Modal.stack]);
        return () => Modal.listeners.delete(listener);
    }

    /**
     * Imperatively opens a modal overlay over the bookmarklet interface.
     */
    public static open(component: ComponentChildren): string {
        const id = `modal_${Math.random().toString(36).substring(2, 9)}`;
        Modal.stack.push({ id, component });
        Modal.notify();
        return id;
    }

    /**
     * Closes the top-most active modal overlay.
     */
    public static close(): void {
        Modal.stack.pop();
        Modal.notify();
    }

    private static notify(): void {
        Modal.listeners.forEach((fn) => fn([...Modal.stack]));
    }
}

export function ModalContainer() {
    const [modals, setModals] = useState<ModalItem[]>([]);

    useEffect(() => {
        return Modal.subscribe((stack) => setModals(stack));
    }, []);

    if (modals.length === 0) return null;
    const currentModal = modals[modals.length - 1];

    return (
        <div
            data-macro-ignore="true"
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2147483647,
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) Modal.close();
            }}
        >
            <div
                style={{
                    backgroundColor: "#1e1f22",
                    border: "1px solid #2b2d31",
                    borderRadius: "8px",
                    padding: "16px",
                    minWidth: "300px",
                    maxWidth: "90vw",
                    maxHeight: "85vh",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                    color: "#dbdee1",
                    overflowY: "auto",
                }}
            >
                {currentModal.component}
            </div>
        </div>
    );
}