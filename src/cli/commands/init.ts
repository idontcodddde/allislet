import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

export async function runInit() {
    const cwd = process.cwd();
    console.log(`\n✨ Initializing new Allislet project in ${cwd}...\n`);

    // 1. Generate package.json if missing
    const pkgPath = resolve(cwd, "package.json");
    if (!existsSync(pkgPath)) {
        const defaultPkg = {
            name: "my-allislet-app",
            version: "0.1.0",
            type: "module",
            scripts: {
                dev: "allislet dev",
                build: "allislet build",
            },
            dependencies: {
                allislet: "^1.0.0",
                preact: "^10.19.0",
                "@preact/signals": "^1.2.2",
            },
        };
        writeFileSync(pkgPath, JSON.stringify(defaultPkg, null, 2));
        console.log("  ✔️ Created package.json");
    }

    // 2. Generate allislet.config.ts
    const configPath = resolve(cwd, "allislet.config.ts");
    if (!existsSync(configPath)) {
        const defaultConfig = `export default {
    theme: {
        mode: "dark",
        defaultDockPosition: "center",
    },
    activeTabs: ["chat"],
};
`;
        writeFileSync(configPath, defaultConfig);
        console.log("  ✔️ Created allislet.config.ts");
    }

    // 3. Generate sample View
    const viewsDir = resolve(cwd, "src/views");
    if (!existsSync(viewsDir)) {
        mkdirSync(viewsDir, { recursive: true });
    }

    const sampleViewPath = resolve(viewsDir, "CustomWidget.tsx");
    if (!existsSync(sampleViewPath)) {
        const sampleView = `import { useSignalValue } from "allislet/hooks";
import { stateRegistry } from "allislet";

export const customCounter = stateRegistry.register("custom_counter", 0);

export const meta = {
    id: "custom_widget",
    label: "My Widget",
    icon: "ph:lightning-bold",
    order: 20,
};

export default function CustomWidget() {
    const count = useSignalValue(customCounter);

    return (
        <div style={{ padding: "16px", color: "#fff" }}>
            <h2>Custom Allislet Widget</h2>
            <p>Counter value: {count}</p>
            <button onClick={() => (customCounter.value += 1)}>
                Increment Signal
            </button>
        </div>
    );
}
`;
        writeFileSync(sampleViewPath, sampleView);
        console.log("  ✔️ Created src/views/CustomWidget.tsx");
    }

    console.log("\n🚀 Project ready! Run:\n  bun install\n  bun run dev\n");
}
