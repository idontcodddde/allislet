import { useState, useEffect, useRef, useMemo } from "preact/hooks";
import { Icon } from "../components/Icon";
import { SocketChatService, ChatMessage, ChatUser } from "../core/SocketChatService";
import { useSignalValue } from "../hooks/useSignalValue";
import {
    chatActiveTabSignal,
    chatActiveTargetSignal,
    chatRoomsSignal,
    chatDmsSignal,
} from "../core/Signals";
export const meta = {
    id: "chat",
    label: "Chatroom & DMs",
    icon: "ph:chats-teardrop-bold",
    order: 10,
};

export default function ChatView() {
    const chatService = SocketChatService.getInstance();

    const [username, setUsername] = useState(chatService.getUsername());
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(username);

    // Reactive State Signals registered via StateRegistry
    const activeTab = useSignalValue(chatActiveTabSignal);
    const activeTarget = useSignalValue(chatActiveTargetSignal);
    const rooms = useSignalValue(chatRoomsSignal);
    const dms = useSignalValue(chatDmsSignal);

    // UI Input states
    const [newRoomInput, setNewRoomInput] = useState("");
    const [dmUserInput, setDmUserInput] = useState("");

    // Unread message badges per target/channel
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Socket subscriptions & automatic incoming DM sender addition
    useEffect(() => {
        const unsubMsg = chatService.onMessage((incoming: any) => {
            // Normalize message payload (single vs array)
            const newMsgs: ChatMessage[] = Array.isArray(incoming) ? incoming : [incoming];

            setMessages((prev) => [...prev, ...newMsgs]);

            for (const msg of newMsgs) {
                // Automatically add sender/partner to recipient's DM list signal if new
                if (msg.targetType === "dm") {
                    const partner = msg.sender === username ? msg.target : msg.sender;
                    if (partner && partner !== username) {
                        if (!chatDmsSignal.value.includes(partner)) {
                            chatDmsSignal.value = [...chatDmsSignal.value, partner];
                        }
                    }
                }

                // Check if message belongs to an unfocused channel to bump unread count
                const isCurrentChannel =
                    (msg.targetType === "global" && activeTab === "global") ||
                    (msg.targetType === "room" && activeTab === "room" && msg.target === activeTarget) ||
                    (msg.targetType === "dm" &&
                        activeTab === "dm" &&
                        (msg.sender === activeTarget || msg.target === activeTarget));

                if (!isCurrentChannel && msg.sender !== username) {
                    const key = msg.targetType === "dm" ? msg.sender : msg.target;
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [key]: (prev[key] || 0) + 1,
                    }));
                }
            }
        });

        const unsubUsers = chatService.onUserList((users) => {
            setOnlineUsers(users);
        });

        const unsubMute = chatService.onMuteChange((muted) => {
            setIsMuted(muted);
        });

        return () => {
            unsubMsg();
            unsubUsers();
            unsubMute();
        };
    }, [username, activeTab, activeTarget]);

    // Switch channel signal & clear its unread count
    const selectChannel = (tab: "global" | "room" | "dm", target: string) => {
        chatActiveTabSignal.value = tab;
        chatActiveTargetSignal.value = target;

        setUnreadCounts((prev) => {
            const updated = { ...prev };
            delete updated[target];
            return updated;
        });
    };

    // Filter messages for current active channel
    const filteredMessages = useMemo(() => {
        return messages.filter((m) => {
            if (activeTab === "global") return m.targetType === "global";
            if (activeTab === "room") return m.targetType === "room" && m.target === activeTarget;
            if (activeTab === "dm") {
                return (
                    m.targetType === "dm" &&
                    ((m.sender === username && m.target === activeTarget) ||
                        (m.sender === activeTarget && m.target === username))
                );
            }
            return false;
        });
    }, [messages, activeTab, activeTarget, username]);

    // Auto-scroll when new relevant messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [filteredMessages.length, activeTarget, activeTab]);

    const handleSaveUsername = () => {
        const trimmed = newUsername.trim();
        if (trimmed) {
            chatService.setUsername(trimmed);
            setUsername(trimmed);
            setEditingUsername(false);
        }
    };

    const handleJoinRoom = () => {
        const trimmed = newRoomInput.trim().toLowerCase();
        if (trimmed) {
            chatService.joinRoom(trimmed);
            if (!rooms.includes(trimmed)) {
                chatRoomsSignal.value = [...rooms, trimmed];
            }
            selectChannel("room", trimmed);
            setNewRoomInput("");
        }
    };

    const handleStartDM = (userToDm?: string) => {
        const target = (userToDm || dmUserInput).trim();
        if (target && target !== username) {
            if (!dms.includes(target)) {
                chatDmsSignal.value = [...dms, target];
            }
            selectChannel("dm", target);
            setDmUserInput("");
        }
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() || isMuted) return;
        const sent = chatService.sendMessage(activeTab, activeTarget, inputMessage.trim());
        if (sent) {
            setInputMessage("");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "8px" }}>
            {/* Header / Identity Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "#111214",
                    border: "1px solid #2b2d31",
                    borderRadius: "6px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                    <Icon icon="ph:user-circle-bold" size="18px" />
                    <span style={{ color: "#b5bac1" }}>Identity:</span>
                    {editingUsername ? (
                        <div style={{ display: "flex", gap: "4px" }}>
                            <input
                                type="text"
                                value={newUsername}
                                onInput={(e) => setNewUsername((e.target as HTMLInputElement).value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveUsername();
                                    if (e.key === "Escape") setEditingUsername(false);
                                }}
                                style={{
                                    backgroundColor: "#1e1f22",
                                    color: "#f2f3f5",
                                    border: "1px solid #3f4248",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "12px",
                                    outline: "none",
                                }}
                                autoFocus
                            />
                            <button
                                onClick={handleSaveUsername}
                                style={{
                                    backgroundColor: "#23a55a",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "2px 8px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <span
                            onClick={() => {
                                setNewUsername(username);
                                setEditingUsername(true);
                            }}
                            style={{ fontWeight: 600, cursor: "pointer", color: "#5865f2" }}
                            title="Click to change username"
                        >
                            {username} <Icon icon="akar-icons:pencil" size="18px" /> 
                        </span>
                    )}
                </div>

                {isMuted && (
                    <span
                        style={{
                            backgroundColor: "#f23f43",
                            color: "#fff",
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: 600,
                        }}
                    >
                        MUTED
                    </span>
                )}
            </div>

            {/* Main Layout Grid */}
            <div style={{ display: "flex", flex: 1, gap: "8px", overflow: "hidden", minHeight: 0 }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: "170px",
                        backgroundColor: "#111214",
                        border: "1px solid #2b2d31",
                        borderRadius: "6px",
                        padding: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        overflowY: "auto",
                    }}
                >
                    {/* Global Room */}
                    <button
                        onClick={() => selectChannel("global", "global")}
                        style={{
                            width: "100%",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: activeTab === "global" ? "#5865f2" : "transparent",
                            color: activeTab === "global" ? "#fff" : "#b5bac1",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            fontWeight: 600,
                        }}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Icon icon="ph:globe-bold" size="14px" /> Public Chat
                        </span>
                        {unreadCounts["global"] > 0 && (
                            <span style={{ backgroundColor: "#f23f43", color: "#fff", borderRadius: "8px", padding: "0 5px", fontSize: "10px" }}>
                                {unreadCounts["global"]}
                            </span>
                        )}
                    </button>

                    {/* Rooms */}
                    <div>
                        <div style={{ fontSize: "10px", color: "#949ba4", fontWeight: 700, marginBottom: "4px" }}>
                            ROOMS
                        </div>
                        {rooms.map((r) => (
                            <div
                                key={r}
                                onClick={() => selectChannel("room", r)}
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    backgroundColor: activeTab === "room" && activeTarget === r ? "#2b2d31" : "transparent",
                                    color: activeTab === "room" && activeTarget === r ? "#fff" : "#b5bac1",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    # {r}
                                </span>
                                {unreadCounts[r] > 0 && (
                                    <span style={{ backgroundColor: "#f23f43", color: "#fff", borderRadius: "8px", padding: "0 5px", fontSize: "10px" }}>
                                        {unreadCounts[r]}
                                    </span>
                                )}
                            </div>
                        ))}
                        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                            <input
                                type="text"
                                placeholder="Join..."
                                value={newRoomInput}
                                onInput={(e) => setNewRoomInput((e.target as HTMLInputElement).value)}
                                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#1e1f22",
                                    border: "1px solid #2b2d31",
                                    color: "#fff",
                                    fontSize: "11px",
                                    borderRadius: "4px",
                                    padding: "3px 6px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={handleJoinRoom}
                                style={{
                                    backgroundColor: "#3f4248",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    cursor: "pointer",
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Direct Messages */}
                    <div>
                        <div style={{ fontSize: "10px", color: "#949ba4", fontWeight: 700, marginBottom: "4px" }}>
                            DIRECT MESSAGES
                        </div>
                        {dms.map((u) => (
                            <div
                                key={u}
                                onClick={() => selectChannel("dm", u)}
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    backgroundColor: activeTab === "dm" && activeTarget === u ? "#2b2d31" : "transparent",
                                    color: activeTab === "dm" && activeTarget === u ? "#fff" : "#b5bac1",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    @ {u}
                                </span>
                                {unreadCounts[u] > 0 && (
                                    <span style={{ backgroundColor: "#f23f43", color: "#fff", borderRadius: "8px", padding: "0 5px", fontSize: "10px" }}>
                                        {unreadCounts[u]}
                                    </span>
                                )}
                            </div>
                        ))}
                        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                            <input
                                type="text"
                                placeholder="DM User..."
                                value={dmUserInput}
                                onInput={(e) => setDmUserInput((e.target as HTMLInputElement).value)}
                                onKeyDown={(e) => e.key === "Enter" && handleStartDM()}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#1e1f22",
                                    border: "1px solid #2b2d31",
                                    color: "#fff",
                                    fontSize: "11px",
                                    borderRadius: "4px",
                                    padding: "3px 6px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={() => handleStartDM()}
                                style={{
                                    backgroundColor: "#3f4248",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    cursor: "pointer",
                                }}
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    {/* Online Roster */}
                    <div style={{ marginTop: "auto" }}>
                        <div style={{ fontSize: "10px", color: "#949ba4", fontWeight: 700, marginBottom: "4px" }}>
                            ONLINE ({onlineUsers.length})
                        </div>
                        <div style={{ maxHeight: "110px", overflowY: "auto", fontSize: "11px" }}>
                            {onlineUsers.map((u) => (
                                <div
                                    key={u.username}
                                    onClick={() => handleStartDM(u.username)}
                                    style={{
                                        padding: "2px 0",
                                        cursor: u.username === username ? "default" : "pointer",
                                        color: u.username === username ? "#23a55a" : "#b5bac1",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={u.username === username ? "You" : `DM ${u.username}`}
                                >
                                    ● {u.username}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Message Display Area */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#111214",
                        border: "1px solid #2b2d31",
                        borderRadius: "6px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                    }}
                >
                    {/* Channel Subheader */}
                    <div
                        style={{
                            paddingBottom: "8px",
                            borderBottom: "1px solid #2b2d31",
                            fontSize: "13px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <Icon icon={activeTab === "dm" ? "ph:at-bold" : "ph:hash-bold"} size="16px" />
                        {activeTab === "global" && "Global Stream"}
                        {activeTab === "room" && `Room: ${activeTarget}`}
                        {activeTab === "dm" && `Direct Message: ${activeTarget}`}
                    </div>

                    {/* Messages Feed */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            padding: "8px 0",
                        }}
                    >
                        {filteredMessages.length === 0 ? (
                            <div style={{ color: "#949ba4", fontSize: "12px", textAlign: "center", marginTop: "20px" }}>
                                Quiet in here. Be the first to speak!
                            </div>
                        ) : (
                            filteredMessages.map((m) => (
                                <div
                                    key={m.id}
                                    style={{
                                        backgroundColor: "#1e1f22",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        maxWidth: "85%",
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    <div style={{ display: "flex", gap: "8px", fontSize: "11px", marginBottom: "2px" }}>
                                        <span style={{ fontWeight: 600, color: m.sender === username ? "#23a55a" : "#5865f2" }}>
                                            {m.sender}
                                        </span>
                                        <span style={{ color: "#949ba4" }}>
                                            {new Date(m.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#dbdee1", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                        {m.content}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Control */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                        <input
                            type="text"
                            disabled={isMuted}
                            placeholder={
                                isMuted
                                    ? "You are muted"
                                    : activeTab === "global"
                                        ? "Message #Global Stream"
                                        : activeTab === "room"
                                            ? `Message #${activeTarget}`
                                            : `Message @${activeTarget}`
                            }
                            value={inputMessage}
                            onInput={(e) => setInputMessage((e.target as HTMLInputElement).value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            style={{
                                flex: 1,
                                backgroundColor: "#1e1f22",
                                border: "1px solid #2b2d31",
                                color: "#fff",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                outline: "none",
                                fontSize: "13px",
                            }}
                        />
                        <button
                            disabled={isMuted}
                            onClick={handleSendMessage}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: isMuted ? "#3f4248" : "#5865f2",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: isMuted ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <Icon icon="ph:paper-plane-right-fill" size="14px" /> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}