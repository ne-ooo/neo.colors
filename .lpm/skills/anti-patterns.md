---
name: anti-patterns
description: Common mistakes when using neo.colors — silent invalid hex/ansi256, named exports can't chain, createColors per call, manual newline splitting, mixed import styles, level degradation surprises
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.js"
---

# Anti-Patterns for @lpm.dev/neo.colors

### [CRITICAL] Writing unsanitized user input to a terminal

Wrong:

```typescript
console.log(colors.red(userProvidedText))
```

Correct:

```typescript
import colors, { sanitizeText } from '@lpm.dev/neo.colors'

console.log(colors.red(sanitizeText(userProvidedText)))
```

Styling preserves nested ANSI by design. Use `sanitizeText()` at the trust
boundary to remove terminal commands while preserving normal log whitespace.

### [CRITICAL] Passing unvalidated hex values — silent unstyled output

Wrong:

```typescript
// User-provided color from config or database
const accentColor = config.accentColor  // Could be 'not-a-color'
console.log(colors.hex(accentColor)('Welcome!'))
// Output: 'Welcome!' — plain text, no color, NO ERROR
```

Correct:

```typescript
const HEX_REGEX = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i

function safeHex(color: string): (text: string) => string {
  if (!HEX_REGEX.test(color)) {
    throw new Error(`Invalid hex color: ${color}`)
  }
  return colors.hex(color)
}

console.log(safeHex(accentColor)('Welcome!'))
```

`hex()` catches invalid input internally and returns an unstyled function. The text renders without color and no error is thrown. If the color comes from user input, config files, or a database, always validate first.

Source: `src/core/chain.ts` — try/catch around hexToRgb, maintainer interview

### [HIGH] Chaining named exports — TypeError at runtime

Wrong:

```typescript
import { red, bold } from '@lpm.dev/neo.colors'

red.bold('text')  // TypeError: red.bold is not a function
```

Correct:

```typescript
// Option A: Use default export for chaining
import colors from '@lpm.dev/neo.colors'
colors.red.bold('text')

// Option B: Nest named function calls (no chaining)
import { red, bold } from '@lpm.dev/neo.colors'
bold(red('text'))
```

Named exports are plain functions `(text: string) => string`, not `StyleFunction` objects with chainable properties. Chaining requires the default or `createColors()` export.

Source: `src/index.ts` — named exports are thin wrappers, maintainer interview

### [HIGH] Creating a new instance per function call

Wrong:

```typescript
function colorize(text: string, color: string): string {
  const c = createColors()  // Creates new closure tree EVERY call
  return c.hex(color)(text)
}
```

Correct:

```typescript
import colors from '@lpm.dev/neo.colors'

function colorize(text: string, color: string): string {
  return colors.hex(color)(text)
}
```

`createColors()` sets up `Object.defineProperty` getters for every style name and runs terminal detection. Creating it per function call adds unnecessary overhead. Use the default export or create a single instance at module level.

Source: `src/core/chain.ts` — closure tree creation, maintainer interview

### [HIGH] Mixing default and named imports — defeats tree-shaking

Wrong:

```typescript
import colors, { red, bold } from '@lpm.dev/neo.colors'

colors.red('hello')  // Uses full object
red('hello')         // Identical output via named export
```

Correct:

```typescript
// Pick ONE style per file:

// Full API (chaining, dynamic colors)
import colors from '@lpm.dev/neo.colors'

// OR tree-shakeable (no chaining)
import { red, bold } from '@lpm.dev/neo.colors'
```

Importing `colors` (the full object) pulls in everything. Adding named imports alongside it is redundant and defeats tree-shaking. Choose one pattern.

Source: `src/index.ts` — named exports wrap the default instance, maintainer interview

### [MEDIUM] Manually splitting lines before styling

Wrong:

```typescript
const lines = multilineText.split('\n')
const styled = lines.map(line => colors.red(line)).join('\n')
```

Correct:

```typescript
const styled = colors.red(multilineText)
```

The library automatically closes and reopens ANSI codes around newlines. Manual splitting produces identical output with more code. The library also correctly handles empty lines (no codes wrapping empty strings) and properly unwinds nested styles per line.

Source: `src/core/chain.ts:42-46` — newline splitting logic, maintainer interview

### [MEDIUM] Expecting ansi256() to downgrade at level 1

Wrong:

```typescript
// "ansi256 should fall back to the nearest basic color"
const colors = createColors({ level: 1 })
colors.ansi256(196)('Error!')
// Output: 'Error!' — plain unstyled text, NOT red
```

Correct:

```typescript
// Use rgb() instead — it DOES downgrade to ANSI16 at level 1
const colors = createColors({ level: 1 })
colors.rgb(255, 0, 0)('Error!')  // → red text (downgraded to ANSI16)

// Or use basic color names which work at all levels >= 1
colors.red('Error!')
```

`ansi256()` returns unstyled text when the terminal level is below 2. It does NOT downgrade to the nearest ANSI16 color. `rgb()` and `hex()` DO downgrade to ANSI16 at level 1. This inconsistency means switching from `rgb()` to `ansi256()` can silently break color support on basic terminals.

Source: `src/core/chain.ts` — level check returns unstyled for ansi256 at level < 2, maintainer interview

### [MEDIUM] Assuming RGB values are exact — silent clamping

Wrong:

```typescript
// Computed color values from animation/interpolation
const r = lerp(startR, endR, t)  // Could be 280.5
const g = lerp(startG, endG, t)  // Could be -10
colors.rgb(r, g, 0)('text')
// Silently clamped to rgb(255, 0, 0) — different color than expected
```

Correct:

```typescript
const r = Math.round(Math.max(0, Math.min(255, lerp(startR, endR, t))))
const g = Math.round(Math.max(0, Math.min(255, lerp(startG, endG, t))))
colors.rgb(r, g, 0)('text')
```

`rgb()` silently clamps values to 0-255 and rounds decimals. For computed colors (lerping, HSL conversion), pre-clamp to detect issues early rather than having the library silently correct your math.

Source: `src/utils/convert.ts` — clampRgb function, maintainer interview
