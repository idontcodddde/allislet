import { Modal } from "../ui/Modal";
import { windowManager } from "../core/WindowManager";
import { config as exampleWindowConfig } from "../windows/ExampleWindow";
import { Icon } from "../components/Icon";
import { Toast } from "../ui/Toast";

export const meta = {
    id: "window-modal-test",
    label: "WindowManager & Modal",
    icon: "ph:window-bold",
    order: 6,
};

export default function WindowTestView() {
    const handleOpenExampleWindow = () => {
        Toast.info("Opened Example Window");
        windowManager.openWindow(exampleWindowConfig);
    };

    const handleOpenModal = () => {
        Modal.open(
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "320px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon icon="ph:info-bold" size="20px" style={{ color: "#5865f2" }} />
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>Test Modal Overlay</h3>
                </div>

                <p style={{ margin: 0, fontSize: "13px", color: "#949ba4", lineHeight: "1.4" }}>
                    This modal was imperatively opened via{" "}
                    <code style={{ color: "#50fa7b", backgroundColor: "#111214", padding: "2px 4px", borderRadius: "3px" }}>
                        Modal.open()
                    </code>
                    . Click outside or press the button below to close it.
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                    <button
                        onClick={() => {
                            Modal.close();
                            Toast.success("Modal closed successfully!");
                        }}
                        style={{
                            padding: "6px 14px",
                            backgroundColor: "#5865f2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Close Modal
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", height: "100%", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>Window, Modal & Toast Sandbox</h3>
                <p style={{ margin: 0, color: "#949ba4", fontSize: "12px" }}>
                    Test opening isolated sidebar windows, imperative modal overlays, and animated floating toasts.
                </p>
            </div>

            {/* Window & Modal Triggers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#5865f2" }}>WINDOWS & MODALS</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        onClick={handleOpenExampleWindow}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            backgroundColor: "#5865f2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "13px",
                        }}
                    >
                        <Icon icon="ph:browsers-bold" size="18px" />
                        Open Example Window
                    </button>

                    <button
                        onClick={handleOpenModal}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            backgroundColor: "#2b2d31",
                            color: "#dbdee1",
                            border: "1px solid #3f4248",
                            borderRadius: "6px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "13px",
                        }}
                    >
                        <Icon icon="ph:square-half-bold" size="18px" />
                        Open Imperative Modal
                    </button>
                </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #2b2d31", margin: "4px 0" }} />

            {/* Toast Notification Triggers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#a6e3a1" }}>TOAST NOTIFICATIONS</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => Toast.success("Operation completed successfully!")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#1c3427",
                            color: "#a6e3a1",
                            border: "1px solid #2e5b41",
                            borderRadius: "6px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        <Icon icon="ph:check-circle-bold" size="16px" />
                        Test Success
                    </button>

                    <button
                        onClick={() => Toast.error("An unexpected error occurred!")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#3a1d28",
                            color: "#f38ba8",
                            border: "1px solid #632b3d",
                            borderRadius: "6px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        <Icon icon="ph:x-circle-bold" size="16px" />
                        Test Error
                    </button>

                    <button
                        onClick={() => Toast.info("Background synchronization running...")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#1e293b",
                            color: "#89b4fa",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        <Icon icon="ph:info-bold" size="16px" />
                        Test Info
                    </button>

                    <button
                        onClick={() =>
                            Toast.custom(
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Icon icon="ph:sparkle-bold" size="18px" style={{ color: "#cba6f7" }} />
                                    <span>Custom Component Rendered in Toast!</span>
                                </div>
                            )
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#2e213d",
                            color: "#cba6f7",
                            border: "1px solid #4a3464",
                            borderRadius: "6px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        <Icon icon="ph:code-bold" size="16px" />
                        Test Custom JSX
                    </button>
                </div>
            </div>
        </div>
    );
}