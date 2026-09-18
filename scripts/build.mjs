import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const binDirectory = resolve(root, "node_modules", ".bin");

function runBinary(name, args) {
    const candidates = process.platform === "win32"
        ? [`${name}.cmd`, `${name}.exe`, name]
        : [name];
    const binary = candidates
        .map((candidate) => resolve(binDirectory, candidate))
        .find((candidate) => existsSync(candidate));

    if (!binary) {
        throw new Error(`Unable to find ${name} in ${binDirectory}`);
    }

    execFileSync(binary, args, {
        cwd: root,
        stdio: "inherit",
    });
}

runBinary("tsc", ["--noEmit"]);
runBinary("vite", ["build"]);
runBinary("vite", ["build", "--config", "vite.standalone.config.ts"]);
