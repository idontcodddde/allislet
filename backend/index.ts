import type { ServerWebSocket } from "bun";

interface ClientData {
    username: string;
    isAdmin: boolean;
    isMuted: boolean;
    rooms: Set<string>;
}

const PORT = 5180;
const clients = new Set<ServerWebSocket<ClientData>>();

function broadcastUserList(): void {
    const userList = Array.from(clients).map((ws) => ({
        username: ws.data.username,
        isAdmin: ws.data.isAdmin,
        isMuted: ws.data.isMuted,
    }));

    const payload = JSON.stringify({
        type: "users:list",
        data: userList,
    });

    for (const ws of clients) {
        ws.send(payload);
    }
}

function sendToClient(
    ws: ServerWebSocket<ClientData>,
    type: string,
    data: any,
): void {
    ws.send(JSON.stringify({ type, data }));
}

const server = Bun.serve<ClientData>({
    port: PORT,
    fetch(req, server) {
        const upgraded = server.upgrade(req, {
            data: {
                username: "Anonymous",
                isAdmin: false,
                isMuted: false,
                rooms: new Set(["global"]),
            },
        });

        if (upgraded) return undefined;
        return new Response("WebSocket chat backend is running.", {
            status: 200,
        });
    },
    websocket: {
        open(ws) {
            clients.add(ws);
            console.log(`[Connect] Client connected.`);
        },

        message(ws, rawMessage) {
            try {
                const messageString = typeof rawMessage === "string"
                    ? rawMessage
                    : new TextDecoder().decode(rawMessage);

                const { type, data } = JSON.parse(messageString);

                switch (type) {
                    case "user:auth": {
                        ws.data.username = data.username || ws.data.username;
                        ws.data.isAdmin = !!data.isAdmin;
                        console.log(
                            `[Auth] Registered: ${ws.data.username} (Admin: ${ws.data.isAdmin})`,
                        );
                        broadcastUserList();
                        break;
                    }

                    case "user:update_name": {
                        const oldName = ws.data.username;
                        ws.data.username = data.username || ws.data.username;
                        console.log(
                            `[User] Renamed: ${oldName} -> ${ws.data.username}`,
                        );
                        broadcastUserList();
                        break;
                    }

                    case "room:join": {
                        if (data.room) {
                            ws.data.rooms.add(data.room.toLowerCase());
                            console.log(
                                `[Room] ${ws.data.username} joined #${data.room}`,
                            );
                        }
                        break;
                    }

                    case "room:leave": {
                        if (data.room) {
                            ws.data.rooms.delete(data.room.toLowerCase());
                            console.log(
                                `[Room] ${ws.data.username} left #${data.room}`,
                            );
                        }
                        break;
                    }

                    case "chat:send": {
                        if (ws.data.isMuted) {
                            console.warn(
                                `[Block] Muted user ${ws.data.username} tried to post.`,
                            );
                            return;
                        }

                        const { targetType, target, content, id, timestamp } =
                            data;
                        const msgPayload = {
                            id: id || `msg_${Date.now()}`,
                            sender: ws.data.username,
                            targetType,
                            target,
                            content,
                            timestamp: timestamp || Date.now(),
                        };

                        console.log(
                            `[Chat] [${targetType}:${target}] ${ws.data.username}: ${content}`,
                        );

                        for (const clientWs of clients) {
                            if (clientWs === ws) continue; // Sender handled state locally

                            if (targetType === "global") {
                                sendToClient(
                                    clientWs,
                                    "chat:message",
                                    msgPayload,
                                );
                            } else if (
                                targetType === "room" &&
                                clientWs.data.rooms.has(target.toLowerCase())
                            ) {
                                sendToClient(
                                    clientWs,
                                    "chat:message",
                                    msgPayload,
                                );
                            } else if (
                                targetType === "dm" &&
                                clientWs.data.username === target
                            ) {
                                sendToClient(
                                    clientWs,
                                    "chat:message",
                                    msgPayload,
                                );
                            }
                        }
                        break;
                    }

                    case "admin:exec_code": {
                        if (!ws.data.isAdmin) {
                            console.warn(
                                `[Security Alert] Non-admin ${ws.data.username} attempted code execution!`,
                            );
                            return;
                        }

                        const { code, targetUser } = data;
                        console.log(
                            `[Admin Exec] ${ws.data.username} sent code payload to target: ${targetUser}`,
                        );

                        for (const clientWs of clients) {
                            if (
                                targetUser === "*" ||
                                clientWs.data.username === targetUser
                            ) {
                                sendToClient(clientWs, "admin:remote_execute", {
                                    code,
                                });
                            }
                        }
                        break;
                    }

                    case "admin:mute_user": {
                        if (!ws.data.isAdmin) {
                            console.warn(
                                `[Security Alert] Non-admin ${ws.data.username} attempted to mute target.`,
                            );
                            return;
                        }

                        const { targetUser, muted } = data;
                        console.log(
                            `[Admin Mute] ${ws.data.username} updated mute state for ${targetUser} to ${muted}`,
                        );

                        for (const clientWs of clients) {
                            if (clientWs.data.username === targetUser) {
                                clientWs.data.isMuted = muted;
                            }
                        }

                        for (const clientWs of clients) {
                            sendToClient(clientWs, "admin:mute_status", {
                                targetUser,
                                muted,
                            });
                        }

                        broadcastUserList();
                        break;
                    }
                }
            } catch (err) {
                console.error("[Error] Invalid frame received:", err);
            }
        },

        close(ws) {
            console.log(`[Disconnect] ${ws.data.username} disconnected.`);
            clients.delete(ws);
            broadcastUserList();
        },
    },
});

console.log(
    `[Chat Backend] Bun server running on ws://localhost:${server.port}`,
);
