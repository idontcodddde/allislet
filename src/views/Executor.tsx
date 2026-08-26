import { useState } from "preact/hooks";
import { useAllislet } from "allislet";
import { Icon } from "../components/Icon";

export const meta = {
    id: "executor",
    label: "JS Executor",
    icon: "ph:terminal-window-bold",
    order: 1,
};

export default function ExecutorView() {
    const { pageExec } = useAllislet();
    const [code, setCode] = useState("console.log('Hello from Allislet!');");

    const handleRun = () => {
        pageExec.runInMainWorld(code);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
            {/* Top Action Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon icon="ph:code-bold" size="18px" /> Script Runner
                </span>
                <button
                    onClick={() => setCode("")}
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid #3f4248",
                        color: "#b5bac1",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                    }}
                >
                    <Icon icon="ph:trash-bold" size="14px" /> Clear
                </button>
            </div>

            {/* Code Editor Area */}
            <textarea
                value={code}
                onInput={(e) => setCode((e.target as HTMLTextAreaElement).value)}
                style={{
                    flex: 1,
                    backgroundColor: "#111214",
                    color: "#50fa7b",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                    padding: "12px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    resize: "none",
                    outline: "none",
                }}
            />

            {/* Execute Action */}
            <button
                onClick={handleRun}
                style={{
                    padding: "10px 16px",
                    backgroundColor: "#5865f2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                <Icon icon="ph:play-fill" size="16px" /> Execute Script
            </button>
        </div>
    );
}