import type { Plugin } from "vite";
import path from "node:path";
import fs from "node:fs";

const CONFIG_FILES = [
    "allislet.config.ts",
    "allislet.config.mts",
    "allislet.config.js",
    "allislet.config.mjs",
];

export function allisletPlugin(): Plugin {
    let resolvedConfigPath: string | null = null;

    return {
        name: "vite-plugin-allislet",
        config(userConfig) {
            const root = userConfig.root ? path.resolve(userConfig.root) : process.cwd();

            for (const file of CONFIG_FILES) {
                const fullPath = path.resolve(root, file);
                if (fs.existsSync(fullPath)) {
                    resolvedConfigPath = fullPath;
                    break;
                }
            }

            if (!resolvedConfigPath) {
                console.warn("[allislet] Warning: No allislet.config.{ts,mts,js,mjs} found in project root.");
                return {};
            }

            return {
                resolve: {
                    alias: {
                        "@config": resolvedConfigPath,
                    },
                },
            };
        },
        configureServer(server) {
            if (resolvedConfigPath) {
                server.watcher.add(resolvedConfigPath);
                server.watcher.on("change", (file) => {
                    if (path.resolve(file) === resolvedConfigPath) {
                        server.ws.send({ type: "full-reload" });
                    }
                });
            }
        },
    };
}