import { useState, useEffect } from "preact/hooks";
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
    const chatService = SocketChatService.getInstance();

    const [isAdmin, setIsAdmin] = useState(AdminStore.isAdmin);
    const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);

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
                    Invoke <code>AdminStore.makeAdmin()</code> to unlock moderation capabilities.
                </span>
            </div>
        );
    }

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