import { build as buildVite } from "vite";
import preact from "@preact/preset-vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

export async function runBuild() {
    const cwd = process.cwd();
    const frameworkRoot = resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../../..",
    );

    console.log("\n📦 Building Allislet application for production...\n");

    const userConfigTs = resolve(cwd, "allislet.config.ts");
    const userConfigJs = resolve(cwd, "allislet.config.js");
    const resolvedConfig = existsSync(userConfigTs)
        ? userConfigTs
        : existsSync(userConfigJs)
        ? userConfigJs
        : resolve(frameworkRoot, "src/core/default.config.ts");

    await buildVite({
        root: cwd,
        configFile: false,
        build: {
            outDir: resolve(cwd, "dist"),
            emptyOutDir: true,
        },
        resolve: {
            alias: [
                { find: "@config", replacement: resolvedConfig },
                {
                    find: "allislet",
                    replacement: resolve(frameworkRoot, "src/index.ts"),
                },
            ],
        },
        plugins: [preact()],
    });

    console.log("\n✨ Build completed! Output written to ./dist\n");
}
