---
name: migrate-from-chalk
description: Step-by-step guide for migrating from chalk to neo.colors — drop-in replacement, API parity, import changes, missing features, and tree-shaking advantage
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.js"
---

# Migrate from Chalk to @lpm.dev/neo.colors

## Quick Comparison

| Aspect | chalk v5 | neo.colors |
|--------|----------|------------|
| Dependencies | 4 runtime (ansi-styles, supports-color, etc.) | Zero |
| Bundle (gzipped) | Varies by version | ~1.1KB named red / ~2.5KB default in regression bundles |
| Performance | Baseline | Same performance class on current benchmarks |
| Cold start | ~1.2ms | ~0.8ms |
| Source code | ~1,500 LOC across packages | ~590 LOC single package |
| Chaining API | Yes | Yes (identical) |
| Dynamic colors | rgb, hex, ansi256 | rgb, hex, ansi256 (identical) |
| Template literals | `chalk.red\`text\`` | Not supported |
| Color detection | Via supports-color | Built-in (identical logic) |
| Tree-shaking | Limited | Full (named exports) |

## Step 1: Replace the Import

```typescript
// Before (chalk v5 — ESM)
import chalk from 'chalk'

// After
import colors from '@lpm.dev/neo.colors'
```

Both use default exports. Find-and-replace `chalk` → `colors` (or keep as `chalk` if you prefer):

```typescript
import chalk from '@lpm.dev/neo.colors'  // Also works
```

## Step 2: All Existing Code Works As-Is

The API is fully compatible. No code changes needed:

### Basic colors and modifiers

```typescript
colors.red('Error!')                    // ✓
colors.bold('Important')                // ✓
colors.red.bold.underline('Critical!')  // ✓
colors.bgBlue.white('Inverted')         // ✓
```

### Dynamic colors

```typescript
colors.rgb(255, 136, 0)('Orange')       // ✓
colors.hex('#ff8800')('Orange')          // ✓
colors.bgHex('#000000').white('Dark')    // ✓
colors.ansi256(196)('Red')              // ✓
```

### Chaining (any order)

```typescript
colors.red.bold('text')                  // ✓
colors.bold.red('text')                  // ✓ (same result)
colors.bgRed.white.bold.underline('!')   // ✓
```

### Nested styles

```typescript
colors.red('Error: ' + colors.bold('critical') + ' failure')  // ✓
```

### Color level

```typescript
colors.level  // 0, 1, 2, or 3 (identical detection)
```

### Multiline handling

```typescript
colors.red('line 1\nline 2')  // ✓ (closes/reopens per line)
```

## Step 3: Handle the One Missing Feature

### Template literals — NOT supported

```typescript
// Chalk — works
chalk.red`Hello ${name}`

// neo.colors — TypeError
colors.red`Hello ${name}`
```

Replace with regular function calls:

```typescript
colors.red(`Hello ${name}`)
```

This is the only API difference. Template literal tags are rarely used in practice — most codebases use function call syntax.

## Step 4: Optional — Use Tree-Shakeable Imports

neo.colors offers named exports that chalk doesn't:

```typescript
// Chalk — always imports everything
import chalk from 'chalk'
chalk.red('text')  // Full chalk loaded

// neo.colors — tree-shakeable named exports
import { red, bold } from '@lpm.dev/neo.colors'
red('text')  // Named red regression bundle: ~1.1KB gzip vs ~2.5KB default
```

Named exports are plain functions (no chaining). Use them when:
- You only need a few styles
- Bundle size matters
- You don't need dynamic colors or chaining

## Step 5: Optional — Use createColors

chalk's `new Chalk({ level })` maps to `createColors`:

```typescript
// Chalk
import { Chalk } from 'chalk'
const forcedChalk = new Chalk({ level: 3 })

// neo.colors
import { createColors } from '@lpm.dev/neo.colors'
const forcedColors = createColors({ level: 3 })
```

### Disabling colors

```typescript
// Chalk
const noChalk = new Chalk({ level: 0 })

// neo.colors — both work
const noColors = createColors({ level: 0 })
const noColors = createColors({ enabled: false })
```

## Environment Variables — Identical

Both respect the same environment variables:

| Variable | Effect |
|----------|--------|
| `NO_COLOR` | Disables colors (any value) |
| `FORCE_COLOR=1` | Force 16 colors |
| `FORCE_COLOR=2` | Force 256 colors |
| `FORCE_COLOR=3` | Force truecolor |
| `COLORTERM=truecolor` | Enable truecolor |
| `TERM=dumb` | Disable colors |

CLI flags `--color` and `--no-color` also work identically.

## Migration Checklist

- [ ] Replace `import chalk from 'chalk'` with `import colors from '@lpm.dev/neo.colors'`
- [ ] Replace `new Chalk({ level })` with `createColors({ level })` if used
- [ ] Search for template literal usage (`` chalk.red`text` ``) and convert to function calls (`colors.red('text')`)
- [ ] Remove `chalk` from dependencies
- [ ] Add `@lpm.dev/neo.colors` to dependencies
- [ ] Optional: switch to named imports for tree-shaking where chaining isn't needed
