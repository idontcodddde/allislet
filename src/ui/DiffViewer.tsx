export interface DiffViewerProps {
    oldText: string;
    newText: string;
    titleOld?: string;
    titleNew?: string;
}

interface LineDiff {
    oldLine: string | null;
    newLine: string | null;
    type: "added" | "removed" | "same" | "modified";
}

export function DiffViewer({
    oldText,
    newText,
    titleOld = "Original",
    titleNew = "Modified",
}: DiffViewerProps) {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");
    const maxLines = Math.max(oldLines.length, newLines.length);
    const diffs: LineDiff[] = [];

    for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i] !== undefined ? oldLines[i] : null;
        const newLine = newLines[i] !== undefined ? newLines[i] : null;

        if (oldLine === newLine) {
            diffs.push({ oldLine, newLine, type: "same" });
        } else if (oldLine !== null && newLine === null) {
            diffs.push({ oldLine, newLine: null, type: "removed" });
        } else if (oldLine === null && newLine !== null) {
            diffs.push({ oldLine: null, newLine, type: "added" });
        } else {
            diffs.push({ oldLine, newLine, type: "modified" });
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1e1e2e",
                color: "#cdd6f4",
                borderRadius: "8px",
                border: "1px solid #313244",
                overflow: "hidden",
                fontFamily: "monospace",
                fontSize: "12px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #313244",
                    backgroundColor: "#181825",
                    fontWeight: "bold",
                }}
            >
                <div style={{ flex: 1, padding: "8px 12px", borderRight: "1px solid #313244" }}>
                    {titleOld}
                </div>
                <div style={{ flex: 1, padding: "8px 12px" }}>{titleNew}</div>
            </div>
            <div style={{ overflowX: "auto" }}>
                {diffs.map((diff, idx) => (
                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #181825" }}>
                        <div
                            style={{
                                flex: 1,
                                padding: "4px 12px",
                                borderRight: "1px solid #313244",
                                backgroundColor:
                                    diff.type === "removed" || diff.type === "modified"
                                        ? "rgba(243, 139, 168, 0.15)"
                                        : "transparent",
                                color:
                                    diff.type === "removed" || diff.type === "modified"
                                        ? "#f38ba8"
                                        : "#cdd6f4",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                            }}
                        >
                            {diff.oldLine !== null ? diff.oldLine : ""}
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: "4px 12px",
                                backgroundColor:
                                    diff.type === "added" || diff.type === "modified"
                                        ? "rgba(166, 227, 161, 0.15)"
                                        : "transparent",
                                color:
                                    diff.type === "added" || diff.type === "modified"
                                        ? "#a6e3a1"
                                        : "#cdd6f4",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                            }}
                        >
                            {diff.newLine !== null ? diff.newLine : ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}