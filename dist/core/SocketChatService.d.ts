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
type TargetChangeCallback = (target: {
    type: "global" | "room" | "dm";
    name: string;
}) => void;
export declare class SocketChatService {
    private static instance;
    private ws;
    private username;
    private isMuted;
    private activeRooms;
    private connectedUsers;
    private messageHistory;
    private dmContacts;
    private activeTargetType;
    private activeTarget;
    private messageListeners;
    private userListListeners;
    private muteListeners;
    private dmContactsListeners;
    private targetChangeListeners;
    private constructor();
    static getInstance(): SocketChatService;
    getUsername(): string;
    setUsername(name: string): void;
    sendAuth(): void;
    private saveUsername;
    getActiveTarget(): {
        type: "global" | "room" | "dm";
        name: string;
    };
    setActiveTarget(type: "global" | "room" | "dm", name: string): void;
    getDMContacts(): string[];
    getMessages(): ChatMessage[];
    private connect;
    private handleIncomingPayload;
    sendMessage(targetType: "global" | "room" | "dm", target: string, content: string): boolean;
    startDM(username: string): void;
    joinRoom(roomName: string): void;
    leaveRoom(roomName: string): void;
    adminBroadcastRemoteCode(code: string, targetUser?: string): void;
    adminMuteUser(targetUser: string, muted: boolean): void;
    onMessage(cb: MessageCallback): () => void;
    onDMContactsChange(cb: DMContactsCallback): () => void;
    onTargetChange(cb: TargetChangeCallback): () => void;
    onUserList(cb: UserListCallback): () => void;
    onMuteChange(cb: MuteCallback): () => void;
    private notifyMessages;
    private notifyDMContacts;
    private sendPayload;
}
export {};
