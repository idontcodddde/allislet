import { createServer as createViteServer } from "vite";
import preact from "@preact/preset-vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

interface DevOptions {
    port: number;
    host: boolean;
}

export async function runDev(options: DevOptions) {
    const cwd = process.cwd();
    const frameworkRoot = resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../../..",
    );

    console.log("\n🚀 Launching Allislet Engine...");

    const userConfigTs = resolve(cwd, "allislet.config.ts");
    const userConfigJs = resolve(cwd, "allislet.config.js");
    const resolvedConfig = existsSync(userConfigTs)
        ? userConfigTs
        : existsSync(userConfigJs)
        ? userConfigJs
        : null;

    try {
        const backendPath = resolve(frameworkRoot, "src/backend/index.ts");
        if (existsSync(backendPath)) {
            import(backendPath);
            console.log("  📡 Backend WebSocket server initialized.");
        }
    } catch (err) {
        console.error("❌ Failed to start backend WebSocket server:", err);
    }

    const vite = await createViteServer({
        root: cwd, // Point directly to the consuming project folder (e.g., example/)
        configFile: false, // Ignore external vite.config.ts files to prevent __dirname errors
        server: {
            port: options.port,
            host: options.host,
            strictPort: true,
        },
        resolve: {
            alias: [
                {
                    find: "@config",
                    replacement: resolvedConfig ||
                        resolve(frameworkRoot, "src/core/default.config.ts"),
                },
                {
                    find: "allislet",
                    replacement: resolve(frameworkRoot, "src/index.ts"),
                },
            ],
        },
        plugins: [preact()],
    });

    await vite.listen();
    console.log(
        `\n  🌐 Frontend UI running at: http://localhost:${options.port}/\n`,
    );
}
