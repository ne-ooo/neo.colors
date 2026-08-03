# Releasing

Releases are published to lpm.dev with the LPM CLI.

## Prerequisites

- Node.js 18 or newer
- pnpm 11.3.0
- An authenticated LPM CLI session for the `ne-ooo` publisher

## Checklist

1. Choose the next semantic version and update `package.json`.
2. Move relevant entries from `Unreleased` into a matching section in
   `CHANGELOG.md`.
3. Install the locked dependency graph with `pnpm install --frozen-lockfile`.
4. Run `pnpm release:check`.
5. Run `lpm publish --check --lpm --min-score 100` and inspect the package
   contents and quality result.
6. Preview the final upload with `lpm publish --dry-run --lpm`.
7. Publish with `lpm publish --lpm`.
8. Create and push the matching Git tag only after publication succeeds.

`pnpm release:check` runs type checking, linting, coverage-gated tests, the
build, bundle-size checks, ESM/CommonJS runtime and type checks, exact package
content validation, and the dependency audit.
