import { useState, useMemo, useEffect } from "preact/hooks";
import { useAllislet } from "../context/AllisletContext";
import { useSignalValue } from "../hooks/useSignalValue";
import { activeTabSignal, userThemeMode } from "../core/Signals";
import { registeredViews } from "../views";
import { Sidebar } from "./Sidebar";
import { App as UserApp } from "../App";

export function AppShell() {
    const { config } = useAllislet();
    const [isMinimized, setIsMinimized] = useState(false);

    const currentTab = useSignalValue(activeTabSignal);
    const currentTheme = useSignalValue(userThemeMode);
    const accentColor = config.theme?.accentColor || "#5865f2";

    const enabledViews = useMemo(() => {
        if (!config.activeTabs || config.activeTabs.length === 0) {
            return registeredViews;
        }
        const matched = config.activeTabs
            .map((id) => registeredViews.find((v) => v.id === id))
            .filter((v): v is typeof registeredViews[number] => Boolean(v));

        return matched.length > 0 ? matched : registeredViews;
    }, [config.activeTabs]);

    const showSidebar = useMemo(() => {
        return Boolean(config.activeTabs?.includes("sidebar"));
    }, [config.activeTabs]);

    // Auto-sync active tab signal to first valid view if unassigned
    useEffect(() => {
        const exists = enabledViews.some((v) => v.id === currentTab);
        if (!exists && enabledViews.length > 0) {
            activeTabSignal.value = enabledViews[0].id;
        }
    }, [enabledViews, currentTab]);

    const activeViewObj =
        enabledViews.find((v) => v.id === currentTab) || enabledViews[0];
    const ActiveComponent = activeViewObj?.Component;

    return (
        <div
            data-window-container
            style={{
                width: "840px",
                height: isMinimized ? "42px" : "540px",
                maxWidth: "92vw",
                maxHeight: "90vh",
                backgroundColor: currentTheme === "dark" ? "#18191c" : "#ffffff",
                color: currentTheme === "dark" ? "#dbdee1" : "#2e3338",
                borderRadius: "10px",
                border: "1px solid #2b2d31",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "height 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {/* Draggable Header */}
            <div
                data-window-drag
                style={{
                    height: "42px",
                    backgroundColor: "#111214",
                    borderBottom: isMinimized ? "none" : "1px solid #2b2d31",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 14px",
                    userSelect: "none",
                    cursor: "grab",
                    touchAction: "none",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "5px",
                            backgroundColor: accentColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: "12px",
                        }}
                    >
                        X
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "13px", color: "#f2f3f5" }}>
                        {String(config.name)}
                    </span>
                </div>

                {/* Window Controls */}
                <div style={{ display: "flex", gap: "6px" }}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={winControlBtnStyle}
                        title="Minimize"
                    >
                        ─
                    </button>
                    <button style={winControlBtnStyle} title="Maximize">
                        □
                    </button>
                    <button
                        onClick={() => {
                            if (typeof config.onCleanup === "function") {
                                config.onCleanup();
                            }
                            const root = document.getElementById(config.id || "allislet-root");
                            if (root) root.remove();
                        }}
                        style={winControlBtnStyle}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Main Container */}
            {!isMinimized && (
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                    {showSidebar && (
                        <Sidebar
                            views={enabledViews}
                            activeTab={activeViewObj?.id || ""}
                            onSelectTab={(tabId) => {
                                activeTabSignal.value = tabId;
                            }}
                            accentColor={accentColor}
                        />
                    )}

                    <div
                        style={{
                            flex: 1,
                            padding: "16px",
                            backgroundColor: "#1e1f22",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto",
                        }}
                    >
                        {showSidebar ? (
                            ActiveComponent ? <ActiveComponent /> : <UserApp />
                        ) : (
                            <UserApp />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const winControlBtnStyle = {
    width: "26px",
    height: "26px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2b2d31",
    color: "#b5bac1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
};