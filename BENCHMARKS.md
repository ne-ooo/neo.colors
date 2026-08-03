# @lpm.dev/neo.colors Benchmarks

## Overview

`@lpm.dev/neo.colors` caches static style branches and normalized dynamic
colors. Repeated calls therefore reuse the same callable style instead of
rebuilding the complete chain API on every property access.

The benchmark compares forced level-3 instances so both libraries perform the
same ANSI work. Auto-detected defaults are deliberately avoided because CI and
non-TTY runners commonly disable both libraries.

## Latest result

Measured on 2026-08-03 using Node.js 26.5.0, Vitest 3.2.7, an Apple M5 Pro,
and Chalk 4.1.2. Operations per second are rounded; results vary by runtime and
hardware.

| Operation | neo.colors | Chalk | Difference |
|---|---:|---:|---:|
| `red(text)` | 41.61M | 47.82M | Chalk 1.15× faster |
| `red.bold.underline(text)` | 33.31M | 34.42M | Effectively equal |
| `bgRed.white.bold(text)` | 33.71M | 31.45M | neo.colors 1.07× faster |
| `rgb(255, 0, 0)(text)` | 7.56M | 8.09M | Chalk 1.07× faster |
| `hex('#ff0000')(text)` | 5.37M | 5.63M | Chalk 1.05× faster |
| Colorful four-part log | 1.64M | 1.59M | Effectively equal |
| Disabled three-style chain | 38.38M | 40.11M | Chalk 1.04× faster |

The two implementations are now in the same performance class. This document
does not claim that either library is universally faster.

## Bundle output

Current unminified build output:

| Artifact | Raw | Gzipped |
|---|---:|---:|
| ESM implementation (`dist/index.js`) | 22.54 KB | 4.88 KB |
| CJS implementation (`dist/index.internal.cjs`) | 23.68 KB | 5.10 KB |
| Native CJS wrapper (`dist/index.cjs`) | 0.74 KB | 0.32 KB |

Consumer bundle regression checks are more representative for tree-shaking:

| Import | Minified | Gzipped |
|---|---:|---:|
| Named `red` only | 2.17 KB | 1.08 KB |
| Chainable default | 6.83 KB | 2.51 KB |

The named import is 68% smaller before gzip and contains no unrelated style
names. `pnpm test:tree-shaking` enforces this property during release checks.

The package has zero runtime dependencies. Development and benchmark
dependencies are not installed for production consumers.

## Running the benchmark

```bash
pnpm install --frozen-lockfile
pnpm bench --run
```

The benchmark source is
[`test/benchmarks/comparison.bench.ts`](./test/benchmarks/comparison.bench.ts).
Keep both comparison instances on the same forced color level when adding new
cases.
