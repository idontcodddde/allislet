import { useState } from "preact/hooks";
import { Icon } from "./Icon";

interface ViewItem {
    id: string;
    name?: string;
    label?: string;
    icon?: string | any;
    Component: any;
}

interface SidebarProps {
    views: ViewItem[];
    activeTab: string;
    onSelectTab: (id: string) => void;
    accentColor: string;
}

export function Sidebar({ views, activeTab, onSelectTab, accentColor }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            style={{
                width: isCollapsed ? "56px" : "180px",
                transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: "#111214",
                borderRight: "1px solid #2b2d31",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "8px 0",
                userSelect: "none",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            {/* Navigation List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 8px" }}>
                {views.map((v) => {
                    const isActive = v.id === activeTab;
                    const label = v.name || v.label || v.id;

                    return (
                        <button
                            key={v.id}
                            onClick={() => onSelectTab(v.id)}
                            title={isCollapsed ? label : undefined}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                height: "40px",
                                padding: isCollapsed ? "0" : "0 12px",
                                justifyContent: isCollapsed ? "center" : "flex-start",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: isActive ? accentColor : "transparent",
                                color: isActive ? "#ffffff" : "#949ba4",
                                cursor: "pointer",
                                fontWeight: isActive ? 600 : 400,
                                fontSize: "13px",
                                transition: "background-color 0.15s ease, color 0.15s ease",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: "20px",
                                }}
                            >
                                {typeof v.icon === "string" ? (
                                    <Icon icon={v.icon} size="20px" />
                                ) : (
                                    v.icon || label.charAt(0).toUpperCase()
                                )}
                            </span>

                            {!isCollapsed && (
                                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Collapse Toggle Button */}
            <div style={{ padding: "0 8px", borderTop: "1px solid #2b2d31", paddingTop: "8px" }}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: "10px",
                        width: "100%",
                        height: "36px",
                        padding: isCollapsed ? "0" : "0 12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#b5bac1",
                        cursor: "pointer",
                        fontSize: "13px",
                    }}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon icon={isCollapsed ? "ph:caret-double-right-bold" : "ph:caret-double-left-bold"} size="16px" />
                    </span>
                    {!isCollapsed && <span>Collapse</span>}
                </button>
            </div>
        </div>
    );
}