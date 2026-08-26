import { useState, useRef } from "preact/hooks";
import { MacroRecorder, MacroAction } from "allislet";
import { Icon } from "../components/Icon";

export const meta = {
    id: "macro-recorder",
    label: "Macro Recorder",
    icon: "ph:record-bold",
    order: 4,
};

export default function MacroView() {
    const recorderRef = useRef(new MacroRecorder());

    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [actions, setActions] = useState<MacroAction[]>([]);
    const [speed, setSpeed] = useState<number>(1);
    const [logs, setLogs] = useState<string[]>([]);

    // Interactive target states for testing inside the view
    const [clickCount, setClickCount] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const handleStartRecording = () => {
        setActions([]);
        setLogs([]);
        recorderRef.current.start();
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        const recordedActions = recorderRef.current.stop();
        setActions(recordedActions);
        setIsRecording(false);
    };

    const handlePlay = async () => {
        if (actions.length === 0) return;
        setIsPlaying(true);
        setLogs([]);

        await recorderRef.current.play(actions, {
            speed,
            onStep: (action, index) => {
                setLogs((prev) => [
                    ...prev,
                    `[${index + 1}/${actions.length}] ${action.type.toUpperCase()} -> ${action.selector}`,
                ]);
            },
        });

        setIsPlaying(false);
    };

    const handleClear = () => {
        setClickCount(0);
        setInputValue("");
        setActions([]);
        setLogs([]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%", overflowY: "auto" }}>
            {/* Top Action Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon icon="ph:video-camera-bold" size="18px" /> DOM Interaction Macro
                </span>
                <button
                    onClick={handleClear}
                    disabled={isRecording || isPlaying}
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
                        opacity: isRecording || isPlaying ? 0.5 : 1,
                    }}
                >
                    <Icon icon="ph:trash-bold" size="14px" /> Clear
                </button>
            </div>

            {/* Controls Bar */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {!isRecording ? (
                    <button
                        onClick={handleStartRecording}
                        disabled={isPlaying}
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#da373c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "13px",
                        }}
                    >
                        <Icon icon="ph:record-fill" size="16px" /> Record
                    </button>
                ) : (
                    <button
                        onClick={handleStopRecording}
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#5865f2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "13px",
                        }}
                    >
                        <Icon icon="ph:stop-fill" size="16px" /> Stop
                    </button>
                )}

                <button
                    onClick={handlePlay}
                    disabled={actions.length === 0 || isPlaying || isRecording}
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: "#23a55a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        fontSize: "13px",
                        opacity: actions.length === 0 || isPlaying || isRecording ? 0.5 : 1,
                    }}
                >
                    <Icon icon="ph:play-fill" size="16px" /> Play ({actions.length})
                </button>

                <select
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat((e.target as HTMLSelectElement).value))}
                    disabled={isPlaying}
                    style={{
                        backgroundColor: "#111214",
                        color: "#dbdee1",
                        border: "1px solid #2b2d31",
                        borderRadius: "6px",
                        padding: "8px",
                        fontSize: "12px",
                        outline: "none",
                    }}
                >
                    <option value={0.5}>0.5x Speed</option>
                    <option value={1}>1.0x Speed</option>
                    <option value={2}>2.0x Speed</option>
                </select>
            </div>

            {/* Interactive Sandbox Section */}
            <div
                style={{
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#949ba4", textTransform: "uppercase" }}>
                    Test Target Bench
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "12px", color: "#b5bac1" }}>Text Input Target</label>
                    <input
                        type="text"
                        value={inputValue}
                        onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
                        placeholder="Type while recording..."
                        style={{
                            backgroundColor: "#1e1f22",
                            border: "1px solid #383a40",
                            borderRadius: "4px",
                            padding: "8px",
                            color: "#dbdee1",
                            fontSize: "13px",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "12px", color: "#b5bac1" }}>Button Click Target</label>
                    <button
                        onClick={() => setClickCount((c) => c + 1)}
                        style={{
                            backgroundColor: "#2b2d31",
                            border: "1px solid #383a40",
                            borderRadius: "4px",
                            padding: "8px",
                            color: "#dbdee1",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 500,
                            textAlign: "left",
                        }}
                    >
                        Click Count: {clickCount}
                    </button>
                </div>
            </div>

            {/* Execution Log Output */}
            <div
                style={{
                    flex: 1,
                    minHeight: "120px",
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                    padding: "10px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#50fa7b",
                    overflowY: "auto",
                }}
            >
                {logs.length === 0 ? (
                    <span style={{ color: "#949ba4", fontFamily: "sans-serif" }}>No macro playback active...</span>
                ) : (
                    logs.map((log, i) => <div key={i}>{log}</div>)
                )}
            </div>
        </div>
    );
}