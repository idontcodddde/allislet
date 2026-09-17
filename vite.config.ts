import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { allisletPlugin } from "./src/plugin";
import path from "path";
import vitePluginDts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        preact(),
        allisletPlugin(),
        vitePluginDts({
            outDir: "dist",
            entryRoot: "src",
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            "allislet": path.resolve(__dirname, "./src/index.ts"),
            "@config": path.resolve(__dirname, "./allislet.config.ts"),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "Allislet",
            fileName: (format) => `allislet.${format === "es" ? "es" : "umd"}.js`,
            formats: ["es", "umd"],
        },
        target: "esnext",
        minify: "terser",
        outDir: "dist",
        cssCodeSplit: false,
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
