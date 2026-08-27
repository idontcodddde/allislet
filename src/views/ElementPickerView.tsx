import { useState } from "preact/hooks";
import { ElementPicker } from "../utils/ElementPicker";
import { Highlighter } from "../utils/Highlighter";
import { DOMFinder } from "../utils/DOMFinder";
import { DOMUtils } from "../utils/DOMutils";
import { FormAutofill } from "../utils/FormAutofill";
import { Icon } from "../components/Icon";

export const meta = {
    id: "element-picker-test",
    label: "DOM Inspector",
    icon: "ph:cursor-click-bold",
    order: 5,
};

export default function ElementPickerView() {
    const [isPicking, setIsPicking] = useState(false);
    const [pickedDetails, setPickedDetails] = useState<{
        tag: string;
        id: string;
        className: string;
        bounds: string;
        parentCount: number;
    } | null>(null);

    const [searchText, setSearchText] = useState("");
    const [xpathQuery, setXpathQuery] = useState("//button");
    const [logs, setLogs] = useState<string[]>([]);

    const handlePickElement = async () => {
        setIsPicking(true);
        const picker = new ElementPicker();
        const node = await picker.pick();
        setIsPicking(false);

        if (!node) {
            setLogs((prev) => ["Selection canceled or target invalid.", ...prev]);
            return;
        }

        Highlighter.clearAll();
        Highlighter.outline(node, {
            border: "2px solid #5865f2",
            backgroundColor: "rgba(88, 101, 242, 0.2)",
        });

        const bounds = DOMUtils.getAbsoluteBounds(node);
        const parents = DOMUtils.parentsUntil(node, "html");

        setPickedDetails({
            tag: node.tagName.toLowerCase(),
            id: node.id || "N/A",
            className: node.className || "N/A",
            bounds: `${Math.round(bounds.width)}px × ${Math.round(bounds.height)}px (pos: ${Math.round(bounds.left)}, ${Math.round(bounds.top)})`,
            parentCount: parents.length,
        });

        setLogs((prev) => [`Picked: <${node.tagName.toLowerCase()}>`, ...prev]);
    };

    const handleClearHighlights = () => {
        Highlighter.clearAll();
        setPickedDetails(null);
        setLogs((prev) => ["Cleared all highlight overlays.", ...prev]);
    };

    const handleSearchByText = () => {
        Highlighter.clearAll();
        if (!searchText.trim()) return;

        const matches = DOMFinder.byText(searchText);
        matches.forEach((el) => {
            Highlighter.outline(el, {
                border: "2px dashed #eab308",
                backgroundColor: "rgba(234, 179, 8, 0.15)",
            });
        });

        setLogs((prev) => [`DOMFinder.byText("${searchText}") -> Found ${matches.length} match(es)`, ...prev]);
    };

    const handleSearchByXPath = () => {
        Highlighter.clearAll();
        if (!xpathQuery.trim()) return;

        const matches = DOMFinder.byXPath(xpathQuery);
        matches.forEach((el) => {
            Highlighter.outline(el, {
                border: "2px dashed #a855f7",
                backgroundColor: "rgba(168, 85, 247, 0.15)",
            });
        });

        setLogs((prev) => [`DOMFinder.byXPath("${xpathQuery}") -> Found ${matches.length} match(es)`, ...prev]);
    };

    const handleAutofillForm = () => {
        FormAutofill.fill("#sample-test-form", {
            username: "alex_developer",
            email: "alex@example.com",
            bio: "Automated testing via FormAutofill utility.",
            newsletter: true,
        });
        setLogs((prev) => ["FormAutofill.fill('#sample-test-form') executed.", ...prev]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%", overflowY: "auto" }}>
            {/* Header Controls */}
            <div data-macro-ignore="true" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                    onClick={handlePickElement}
                    disabled={isPicking}
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: isPicking ? "#eb459e" : "#5865f2",
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
                    <Icon icon="ph:cursor-click-fill" size="16px" />
                    {isPicking ? "Click Any Target..." : "Pick Element"}
                </button>

                <button
                    onClick={handleClearHighlights}
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "transparent",
                        border: "1px solid #3f4248",
                        color: "#b5bac1",
                        borderRadius: "6px",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                    }}
                >
                    <Icon icon="ph:eraser-bold" size="16px" /> Clear Overlays
                </button>
            </div>

            {/* Inspection Results */}
            {pickedDetails && (
                <div
                    style={{
                        backgroundColor: "#111214",
                        border: "1px solid #2b2d31",
                        borderRadius: "6px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                    }}
                >
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#5865f2", fontFamily: "sans-serif" }}>
                        PICKED ELEMENT DETAILS
                    </span>
                    <div><strong style={{ color: "#949ba4" }}>Tag:</strong> {pickedDetails.tag}</div>
                    <div><strong style={{ color: "#949ba4" }}>ID:</strong> {pickedDetails.id}</div>
                    <div><strong style={{ color: "#949ba4" }}>Classes:</strong> {pickedDetails.className}</div>
                    <div><strong style={{ color: "#949ba4" }}>Absolute Bounds:</strong> {pickedDetails.bounds}</div>
                    <div><strong style={{ color: "#949ba4" }}>Parents to Root:</strong> {pickedDetails.parentCount}</div>
                </div>
            )}

            {/* Search Tools (DOMFinder) */}
            <div
                data-macro-ignore="true"
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
                    DOM Finder Tools
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                    <input
                        type="text"
                        value={searchText}
                        onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
                        placeholder="Search DOM by text..."
                        style={{
                            flex: 1,
                            backgroundColor: "#1e1f22",
                            border: "1px solid #383a40",
                            borderRadius: "4px",
                            padding: "6px 8px",
                            color: "#dbdee1",
                            fontSize: "12px",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleSearchByText}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#eab308",
                            color: "#000",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Find Text
                    </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                    <input
                        type="text"
                        value={xpathQuery}
                        onInput={(e) => setXpathQuery((e.target as HTMLInputElement).value)}
                        placeholder="XPath query (e.g. //button)"
                        style={{
                            flex: 1,
                            backgroundColor: "#1e1f22",
                            border: "1px solid #383a40",
                            borderRadius: "4px",
                            padding: "6px 8px",
                            color: "#dbdee1",
                            fontSize: "12px",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleSearchByXPath}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#a855f7",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Find XPath
                    </button>
                </div>
            </div>

            {/* Form Autofill Bench */}
            <form
                id="sample-test-form"
                onSubmit={(e) => e.preventDefault()}
                style={{
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#949ba4", textTransform: "uppercase" }}>
                        Autofill Test Bench (#sample-test-form)
                    </span>
                    <button
                        type="button"
                        data-macro-ignore="true"
                        onClick={handleAutofillForm}
                        style={{
                            backgroundColor: "#23a55a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontWeight: 600,
                            fontSize: "11px",
                            cursor: "pointer",
                        }}
                    >
                        Autofill Test Form
                    </button>
                </div>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    style={{
                        backgroundColor: "#1e1f22",
                        border: "1px solid #383a40",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        color: "#dbdee1",
                        fontSize: "12px",
                    }}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    style={{
                        backgroundColor: "#1e1f22",
                        border: "1px solid #383a40",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        color: "#dbdee1",
                        fontSize: "12px",
                    }}
                />
                <textarea
                    name="bio"
                    placeholder="Bio"
                    rows={2}
                    style={{
                        backgroundColor: "#1e1f22",
                        border: "1px solid #383a40",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        color: "#dbdee1",
                        fontSize: "12px",
                    }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#b5bac1" }}>
                    <input name="newsletter" type="checkbox" /> Subscribe to newsletter
                </label>
            </form>

            {/* Event Console */}
            <div
                data-macro-ignore="true"
                style={{
                    flex: 1,
                    minHeight: "100px",
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                    padding: "10px",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "#50fa7b",
                    overflowY: "auto",
                }}
            >
                {logs.length === 0 ? (
                    <span style={{ color: "#949ba4", fontFamily: "sans-serif" }}>Inspector activity logs will appear here...</span>
                ) : (
                    logs.map((log, i) => <div key={i}>{log}</div>)
                )}
            </div>
        </div>
    );
}