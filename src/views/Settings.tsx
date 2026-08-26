import { useAllislet } from "allislet";
import { Icon } from "../components/Icon";
import { userThemeMode } from "../core/Signals";
import { useSignalValue } from "../hooks/useSignalValue";

export const meta = {
    id: "settings",
    label: "Settings",
    icon: "ph:gear-six-bold",
    order: 99,
};

export default function SettingsView() {
    const { storage } = useAllislet();
    const currentTheme = useSignalValue(userThemeMode);

    const toggleTheme = () => {
        userThemeMode.value = currentTheme === "dark" ? "light" : "dark";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #2b2d31", paddingBottom: "8px" }}>
                <Icon icon="ph:gear-six-bold" size="20px" />
                <h3 style={{ margin: 0, fontSize: "16px" }}>Preferences</h3>
            </div>

            {/* Theme Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon icon={currentTheme === "dark" ? "ph:moon-bold" : "ph:sun-bold"} size="18px" />
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>Theme Mode</div>
                        <div style={{ fontSize: "11px", color: "#949ba4" }}>Current: {currentTheme}</div>
                    </div>
                </div>
                <button
                    onClick={toggleTheme}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#2b2d31",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <Icon icon="ph:arrows-clockwise-bold" size="14px" /> Toggle
                </button>
            </div>

            {/* Storage Reset */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon icon="ph:database-bold" size="18px" />
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>Clear Storage</div>
                        <div style={{ fontSize: "11px", color: "#949ba4" }}>Wipe local state & persistent caches</div>
                    </div>
                </div>
                <button
                    onClick={() => storage?.clear?.()}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#da373c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <Icon icon="ph:trash-bold" size="14px" /> Clear
                </button>
            </div>
        </div>
    );
}