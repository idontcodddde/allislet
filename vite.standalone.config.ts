import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";

export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: {
            allislet: path.resolve(__dirname, "./src/index.ts"),
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, "src/standalone.ts"),
            name: "Allislet",
            fileName: () => "standalone.js",
            formats: ["es"],
        },
        target: "esnext",
        minify: "terser",
        rollupOptions: {
            external: [],
        },
        terserOptions: {
            mangle: false,
            keep_classnames: true,
            keep_fnames: true,
        },
    },
});
