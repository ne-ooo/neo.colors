---
name: getting-started
description: How to import and use neo.colors — default export, named exports, chaining, dynamic colors (rgb/hex/ansi256), createColors factory, terminal detection, and color levels
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.tsx"
  - "**/*.jsx"
---

# Getting Started with @lpm.dev/neo.colors

## Two Import Styles

### Object style (full API, chaining, dynamic colors)

```typescript
import colors from '@lpm.dev/neo.colors'

colors.red('Error!')
colors.red.bold('Critical!')
colors.hex('#ff6600').underline('Warning')
colors.rgb(255, 128, 0).bold('Custom color')
colors.cyan('port', 3000, 'ready')  // Multiple values join with spaces
```

Use this when you need chaining or dynamic colors.

### Named imports (tree-shakeable, no chaining)

```typescript
import { red, bold, green } from '@lpm.dev/neo.colors'

red('Error!')
bold('Important')
green('Success')
```

Use this when you only need a few styles and want minimal bundle size. Named exports are plain functions — they cannot chain (see Anti-patterns).

**Pick one style per file.** Don't mix both imports — it defeats tree-shaking.

## Chaining

Chain any combination of styles. Order doesn't matter:

```typescript
import colors from '@lpm.dev/neo.colors'

colors.red.bold('text')              // same as colors.bold.red('text')
colors.bgBlue.white.bold('text')     // background + foreground + modifier
colors.red.bold.underline('text')    // multiple modifiers
```

## Available Styles

### Modifiers

`bold`, `dim`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `reset`

### Foreground colors

`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`

### Bright foreground colors

`blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### Aliases

`gray` and `grey` are both `blackBright`. `bgGray` and `bgGrey` are both `bgBlackBright`.

### Background colors

All foreground colors have `bg` variants: `bgRed`, `bgGreen`, `bgBlue`, `bgRedBright`, etc.

## Dynamic Colors

### RGB (0-255 per channel)

```typescript
colors.rgb(255, 0, 0)('Red text')
colors.bgRgb(0, 255, 0)('Green background')
```

Values are clamped to 0-255 automatically. Out-of-range values are silently corrected.

### Hex

```typescript
colors.hex('#ff0000')('Red text')
colors.hex('#f00')('Shorthand')
colors.hex('ff0000')('Without #')
colors.bgHex('#00ff00')('Green background')
```

Invalid hex values silently return unstyled text — no error is thrown.

### ANSI256 (0-255 palette)

```typescript
colors.ansi256(196)('Red from 256 palette')
colors.bgAnsi256(21)('Blue background')
```

Out-of-range codes silently return unstyled text.

## Color Levels

The library auto-detects terminal capabilities:

| Level | Colors | When |
|-------|--------|------|
| 0 | None | `NO_COLOR` set, piped output, `--no-color` flag |
| 1 | 16 basic | Most CI environments, basic terminals |
| 2 | 256 palette | `xterm-256color`, Apple Terminal |
| 3 | 16 million (truecolor) | iTerm 3+, modern terminals, `COLORTERM=truecolor` |

Check the current level:

```typescript
import colors from '@lpm.dev/neo.colors'
console.log(colors.level)  // 0, 1, 2, or 3
```

### Color downgrading

Dynamic colors automatically downgrade to match the terminal:

- **Level 3**: RGB/hex rendered directly as truecolor
- **Level 2**: RGB/hex converted to nearest ANSI256 palette color
- **Level 1**: RGB/hex converted to nearest ANSI16 basic color. `ansi256()` returns unstyled (no downgrade)
- **Level 0**: All colors stripped, plain text returned

## createColors Factory

For most use cases, the default export is sufficient. Use `createColors()` only when you need:

### Force a specific color level

```typescript
import { createColors } from '@lpm.dev/neo.colors'

// Force truecolor in CI
const colors = createColors({ level: 3 })

// Force no colors for testing
const noColors = createColors({ level: 0 })
noColors.red('text')  // → 'text' (no ANSI codes)
```

### Disable colors explicitly

```typescript
const plain = createColors({ enabled: false })
plain.red.bold('text')  // → 'text'
```

The level is mutable and shared by existing cached branches:

```typescript
const error = colors.red.bold
colors.level = 0
error('plain')  // → 'plain'
```

### Stderr-specific instance

```typescript
import { createColors, getStderrColorSupport } from '@lpm.dev/neo.colors'

const stderrColors = createColors({ level: getStderrColorSupport().level })
```

Create the instance once at module level — never inside a function or loop.

## Terminal Detection

```typescript
import { detectColorSupport, getStdoutColorSupport, getStderrColorSupport } from '@lpm.dev/neo.colors'

const support = getStdoutColorSupport()
// { level: 3, hasBasic: true, has256: true, has16m: true }
```

Detection checks (in priority order): `--color`/`--no-color` CLI flags, `FORCE_COLOR` env, `NO_COLOR`/`TERM=dumb` opt-outs, the target stream's TTY state, then platform, CI, `TERM_PROGRAM`, `TERM`, and `COLORTERM` capabilities.

## Untrusted Text

Color functions preserve nested ANSI sequences. Sanitize values from users,
remote services, or databases at the trust boundary:

```typescript
import colors, { sanitizeText } from '@lpm.dev/neo.colors'

console.log(colors.red(sanitizeText(untrustedText)))
```

## Multiline Strings

Colors automatically close and reopen around newlines:

```typescript
colors.red('line 1\nline 2\nline 3')
// Each line gets its own ANSI open/close codes
// Works correctly in all terminals and log processors
```

No need to split lines manually — the library handles it.

## TypeScript Types

```typescript
import type {
  StyleFunction,     // Chainable style function
  ColorLevel,        // 0 | 1 | 2 | 3
  ColorSupport,      // { level, hasBasic, has256, has16m }
  ColorOptions,      // { level?, enabled? }
  AnsiCode           // { open: string, close: string }
} from '@lpm.dev/neo.colors'
```
