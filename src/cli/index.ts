#!/usr/bin/env bun
import { parseArgs } from "util";
import { runInit } from "./commands/init";
import { runDev } from "./commands/dev";
import { runBuild } from "./commands/build";

async function main() {
    const { values, positionals } = parseArgs({
        args: Bun.argv.slice(2),
        options: {
            port: { type: "string", short: "p", default: "3000" },
            host: { type: "boolean", default: false },
            help: { type: "boolean", short: "h", default: false },
        },
        allowPositionals: true,
    });

    const command = positionals[0];

    if (values.help || !command) {
        showHelp();
        process.exit(0);
    }

    switch (command) {
        case "init":
            await runInit();
            break;

        case "dev":
            await runDev({
                port: parseInt(values.port || "3000", 10),
                host: values.host || false,
            });
            break;

        case "build":
            await runBuild();
            break;

        default:
            console.error(`❌ Unknown command: "${command}"\n`);
            showHelp();
            process.exit(1);
    }
}

function showHelp() {
    console.log(`
⚡ Allislet Framework CLI

Usage:
  allislet <command> [options]

Commands:
  init       Scaffold a new Allislet project in the current directory
  dev        Start backend WebSocket server & Vite frontend dev server
  build      Bundle the application for production deployment

Options:
  -p, --port <number>  Specify frontend dev server port (default: 3000)
  --host               Expose server to local network
  -h, --help           Show help information
`);
}

main().catch((err) => {
    console.error("🔥 CLI Fatal Error:", err);
    process.exit(1);
});
