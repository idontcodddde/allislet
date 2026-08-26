import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: {
            "allislet": path.resolve(__dirname, "./src/index.ts"),
            "@config": path.resolve(__dirname, "./allislet.config.ts"),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/main.tsx"),
            name: "Allislet",
            fileName: () => "allislet.bundle.js",
            formats: ["iife"],
        },
        target: "esnext",
        minify: true,
    },
});
