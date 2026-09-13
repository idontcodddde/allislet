import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const changelogPath = join(root, "CHANGELOG.md");
const dryRun = process.argv.includes("--dry-run");

function parseReleaseHeader(line: string): { name: string; tag: string; version: string } | null {
  const match = /^##\s+(.*?\bv?\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?\b.*)$/.exec(line.trim());
  if (!match) return null;

  const name = match[1].trim();
  const versionMatch = /v?\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?/.exec(name);
  if (!versionMatch) return null;

  const version = versionMatch[0];
  const tag = version.startsWith("v") ? version : `v${version}`;

  return {
    name,
    tag,
    version,
  };
}

function parseChangelog(): Array<{ name: string; tag: string; version: string; section: string }> {
  const text = readFileSync(changelogPath, "utf8");
  const lines = text.split(/\r?\n/);
  const releases: Array<{ name: string; tag: string; version: string; section: string }> = [];

  let current: { name: string; tag: string; version: string; section: string } | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    const header = parseReleaseHeader(line);
    if (header) {
      if (current) {
        releases.push({ ...current, section: buffer.join("\n").trim() });
      }

      current = {
        name: header.name,
        tag: header.tag,
        version: header.version,
        section: "",
      };
      buffer = [];
      continue;
    }

    if (current) {
      buffer.push(line);
    }
  }

  if (current) {
    releases.push({ ...current, section: buffer.join("\n").trim() });
  }

  return releases;
}

function makeReleaseBody(release: { name: string; tag: string; version: string; section: string }): string {
  return `# ${release.name}\n\n${release.section.trim()}\n`;
}

function ensureGhWorkflow(): void {
  const workflowDir = join(root, ".github", "workflows");
  const workflowPath = join(workflowDir, "ci.yml");
  const workflow = `name: CI\n\non:\n  push:\n    branches: ["main", "master"]\n  pull_request:\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: oven-sh/setup-bun@v2\n        with:\n          bun-version: latest\n\n      - name: Install dependencies\n        run: bun install\n\n      - name: Type check\n        run: bun run typecheck\n\n      - name: Build\n        run: bun run build\n`;

  if (!existsSync(workflowDir)) {
    throw new Error(".github/workflows directory is missing");
  }

  if (!existsSync(workflowPath)) {
    writeFileSync(workflowPath, workflow, "utf8");
  }
}

const releases = parseChangelog();
if (!releases.length) {
  throw new Error("No release headers found in CHANGELOG.md. Use headings like ## Allislet SDK v1.0.0");
}

const newest = releases[0];
console.log(`Detected release: ${newest.name}`);
console.log(`Tag: ${newest.tag}`);
console.log(`Version: ${newest.version}`);

if (!dryRun) {
  ensureGhWorkflow();
  console.log(`Release metadata is ready for ${newest.tag}.`);
  console.log("Use GitHub Releases UI or a future automation step to publish this tag.");
} else {
  console.log("Dry run: no release published.\n");
  console.log(makeReleaseBody(newest));
}
