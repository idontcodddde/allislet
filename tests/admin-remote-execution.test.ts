import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = join(import.meta.dir, "..");

async function readProjectFile(relativePath: string): Promise<string> {
    return readFile(join(projectRoot, relativePath), "utf8");
}

describe("admin remote execution removal", () => {
    test("does not expose a remote execution protocol in the client", async () => {
        const source = await readProjectFile("src/core/SocketChatService.ts");

        expect(source).not.toContain("admin:remote_execute");
        expect(source).not.toContain("admin:exec_code");
        expect(source).not.toContain("adminBroadcastRemoteCode");
        expect(source).not.toContain("new Function(payload.data.code)");
    });

    test("does not accept or forward remote execution in the backend", async () => {
        const source = await readProjectFile("backend/index.ts");

        expect(source).not.toContain("admin:exec_code");
        expect(source).not.toContain("admin:remote_execute");
        expect(source).not.toContain("Admin Exec");
    });

    test("does not render script dispatch controls in the admin view", async () => {
        const source = await readProjectFile("src/views/AdminView.tsx");

        expect(source).not.toContain("Broadcast Payload");
        expect(source).not.toContain("Run Locally");
        expect(source).not.toContain("remoteCode");
        expect(source).toContain("adminMuteUser");
    });
});
