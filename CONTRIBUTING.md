# Contributing to Allislet

Thanks for helping improve Allislet.

This project is a browser SDK for building shadow-isolated bookmarklets and injected applications. Contributions are welcome as long as they are aligned with the project’s goal: a reusable, host-safe runtime foundation for browser tooling and UI overlays.

## Ways to contribute

- report bugs and edge cases
- suggest new features or UX improvements
- improve docs and examples
- improve runtime safety and compatibility
- help refine the SDK architecture and configuration model
- improve tests and build reliability

## Development setup

```bash
bun install
bun run dev
```

For a production verification pass:

```bash
bun run typecheck
bun run build
```

## Branching and workflow

- create a feature branch from main
- keep commits focused and descriptive
- update relevant docs when behavior or configuration changes
- avoid unrelated formatting churn in the same PR

## Pull request expectations

Before opening a pull request:

1. ensure the project typechecks with the repo workflow
2. verify the project builds successfully
3. document any config or behavior changes
4. keep examples and docs in sync with the implementation

## Coding standards

- prefer TypeScript-safe patterns and explicit types where useful
- keep runtime behavior host-safe and isolated
- avoid introducing obvious host-page style leakage or global side effects
- preserve the app’s config-first structure and runtime layering

## Reporting issues

Use the issue templates in the repository so the maintainers can act quickly on:

- bugs
- feature requests
- documentation improvements
- implementation or runtime concerns

## Security issues

Please do not open public issues for sensitive security problems. Follow the instructions in SECURITY.md.
