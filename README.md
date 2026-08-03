# @lpm.dev/neo.colors

> **Zero-dependency terminal colors** - Fast, modern, tree-shakeable alternative to chalk


## Features

- ✅ **Zero dependencies** - No `node_modules` bloat
- ✅ **Competitive performance** - Cached chains benchmark in the same class as chalk
- ✅ **Small named bundles** - A single named color is ~1.1 KB gzipped
- ✅ **Chalk-compatible calls** - Chaining, nesting, and multiple arguments
- ✅ **Full TypeScript support** - Strict mode, zero `any` types
- ✅ **ESM + CommonJS** - Works everywhere
- ✅ **Tree-shakeable** - Import only what you need
- ✅ **Auto color detection** - Respects NO_COLOR, FORCE_COLOR, CI environments
- ✅ **16m colors** - RGB, hex, 256-color palette
- ✅ **Coverage-gated tests** - Source coverage thresholds enforced before publish

## Quick Start

```bash
lpm install @lpm.dev/neo.colors
```

```typescript
import colors from '@lpm.dev/neo.colors'

console.log(colors.red('Error!'))
console.log(colors.green.bold('Success!'))
console.log(colors.blue.underline('https://example.com'))
```

Native CommonJS receives the same chainable callable:

```javascript
const colors = require('@lpm.dev/neo.colors')

console.log(colors.red.bold('Error!'))
```

## Why @lpm.dev/neo.colors?

### Chalk went ESM-only

Chalk v5 dropped CommonJS support, breaking millions of projects. @lpm.dev/neo.colors supports **both ESM and CommonJS** out of the box.

### Dependencies Add Up

Chalk used to have 4 dependencies totaling ~1,200 lines of code. We've **inlined and optimized everything** into a single, zero-dependency package.

### Modern & Fast

Built from the ground up with:
- Node 18+ target (modern JavaScript features)
- TypeScript-first architecture
- Performance-optimized algorithms
- Tree-shakeable exports

[See benchmarks →](./BENCHMARKS.md)

## API

### Basic Colors

```typescript
import colors from '@lpm.dev/neo.colors'

// Foreground colors
colors.black('text')
colors.red('text')
colors.green('text')
colors.yellow('text')
colors.blue('text')
colors.magenta('text')
colors.cyan('text')
colors.white('text')
colors.gray('text')     // or .grey

// Background colors
colors.bgBlack('text')
colors.bgRed('text')
colors.bgGreen('text')
colors.bgYellow('text')
colors.bgBlue('text')
colors.bgMagenta('text')
colors.bgCyan('text')
colors.bgWhite('text')
colors.bgGray('text')   // or .bgGrey

// Bright colors
colors.redBright('text')
colors.greenBright('text')
// ... and more
```

### Styles

```typescript
colors.bold('text')
colors.dim('text')
colors.italic('text')
colors.underline('text')
colors.inverse('text')
colors.hidden('text')
colors.strikethrough('text')
```

### Chaining

```typescript
// Chain any combination of colors and styles
colors.red.bold('Error!')
colors.green.bold.underline('Success!')
colors.blue.bgWhite.bold('Info')

// Multiple values are joined with spaces, like Chalk
colors.cyan('port', 3000, 'ready')

// Order doesn't matter - they all stack
colors.bold.red('text')  // same as
colors.red.bold('text')
```

### RGB & Hex Colors

```typescript
// RGB (0-255 for each channel)
colors.rgb(255, 0, 0)('Bright red')
colors.bgRgb(0, 255, 0)('Green background')

// Hex colors
colors.hex('#ff0000')('Red from hex')
colors.bgHex('#00ff00')('Green bg from hex')

// Shorthand hex
colors.hex('#f00')('Also red')

// Chain with other styles
colors.hex('#ff6b6b').bold.underline('Fancy!')
```

### 256-Color Palette

```typescript
// Use any color from the 256-color palette (0-255)
colors.ansi256(196)('Bright red')
colors.bgAnsi256(21)('Blue background')
```

### Tree-Shakeable Imports

```typescript
// Import only what you need for optimal bundle size
import { red, bold, green } from '@lpm.dev/neo.colors'

console.log(red('Error'))
console.log(bold(green('Success')))
```

### Custom Instances

```typescript
import { createColors } from '@lpm.dev/neo.colors'

// Force specific color level
const colors = createColors({ level: 3 }) // 0=none, 1=16, 2=256, 3=16m

// Disable colors
const noColors = createColors({ enabled: false })
const text = noColors.red('text') // → 'text' (no colors)

// Levels are mutable and shared by every cached branch
const error = colors.red.bold
colors.level = 0
error('plain text') // → 'plain text'
```

### TypeScript

```typescript
import colors, { StyleFunction } from '@lpm.dev/neo.colors'

const colorize: StyleFunction = colors.red.bold

// All types are exported
import type { ColorLevel, ColorSupport, ColorOptions } from '@lpm.dev/neo.colors'
```

## Environment Variables

### NO_COLOR

Disables colors when set (any value):
```bash
NO_COLOR=1 node app.js
```

### FORCE_COLOR

Forces color output:
```bash
FORCE_COLOR=1 node app.js  # Force basic colors (level 1)
FORCE_COLOR=2 node app.js  # Force 256 colors (level 2)
FORCE_COLOR=3 node app.js  # Force 16 million colors (level 3)
```

### CLI Flags

```bash
node app.js --color        # Force colors
node app.js --no-color     # Disable colors
node app.js --color=256    # Force 256-color mode
node app.js --color=16m    # Force truecolor mode
```

## Untrusted Terminal Output

Styling functions preserve existing ANSI sequences so nested colors continue
to work. Sanitize user-controlled values explicitly before writing them to a
terminal:

```typescript
import colors, { sanitizeText } from '@lpm.dev/neo.colors'

const safeName = sanitizeText(untrustedName)
console.log(colors.green('User:', safeName))
```

`sanitizeText()` removes CSI styling, OSC hyperlinks/title/clipboard commands,
other terminal control strings, and unsafe C0/C1 controls. Newlines, carriage
returns, and tabs are preserved.

## Color Detection

@lpm.dev/neo.colors automatically detects terminal capabilities:

1. **CLI flags** (`--color`, `--no-color`) - highest priority
2. **FORCE_COLOR** environment variable
3. **NO_COLOR** environment variable
4. **TERM=dumb** explicit opt-out
5. **Target stream TTY check** - piped output stays plain
6. **Platform and CI detection**
7. **Terminal capabilities** (COLORTERM, TERM, TERM_PROGRAM)

```typescript
import { detectColorSupport } from '@lpm.dev/neo.colors'

const support = detectColorSupport()
console.log(support)
// {
//   level: 3,          // 0=none, 1=16, 2=256, 3=16m
//   hasBasic: true,    // 16 colors
//   has256: true,      // 256 colors
//   has16m: true       // 16 million colors (truecolor)
// }
```

## Migration from Chalk

@lpm.dev/neo.colors is a drop-in replacement for Chalk's standard function-call API:

```diff
- import chalk from 'chalk'
+ import colors from '@lpm.dev/neo.colors'

- console.log(chalk.red.bold('Error!'))
+ console.log(colors.red.bold('Error!'))
```

### API Differences

99% compatible. Minor differences:
- Template literals are not supported (use string concatenation instead)
- Some rarely-used features may differ slightly

For normal function-call usage, migration is usually an import-only change.

## Examples

### Error Messages

```typescript
import colors from '@lpm.dev/neo.colors'

console.error(colors.red.bold('Error:'), colors.red('File not found'))
console.warn(colors.yellow.bold('Warning:'), colors.yellow('Deprecated API'))
console.log(colors.green.bold('✓'), colors.green('Build successful!'))
```

### Pretty Logs

```typescript
const timestamp = colors.gray(new Date().toISOString())
const level = colors.cyan.bold('[INFO]')
const message = colors.white('Server started')
const url = colors.blue.underline('http://localhost:3000')

console.log(`${timestamp} ${level} ${message} on ${url}`)
// → [gray]2025-01-15T10:30:00.000Z[/gray] [cyan][INFO][/cyan] Server started on [blue]http://localhost:3000[/blue]
```

### Progress Indicators

```typescript
const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
let i = 0

setInterval(() => {
  process.stdout.write(`\r${colors.cyan(spinner[i])} Loading...`)
  i = (i + 1) % spinner.length
}, 80)
```

### Diff Output

```typescript
console.log(colors.green('+ Added line'))
console.log(colors.red('- Removed line'))
console.log(colors.dim('  Unchanged line'))
```

## Performance

See [BENCHMARKS.md](./BENCHMARKS.md) for detailed performance comparison.

**Summary**:
- ✅ Cached hot paths perform in the same class as chalk
- ✅ Named imports eliminate the chainable API and unrelated styles

## Browser Support

@lpm.dev/neo.colors is designed for **Node.js environments** (CLI tools, build scripts, servers). For browser-based coloring, consider CSS.

## Security

For vulnerability reporting and supported-version information, see
[SECURITY.md](./SECURITY.md). Please do not disclose suspected vulnerabilities
in a public issue before they have been investigated.

## License

MIT © neo

## Credits

Inspired by [chalk](https://github.com/chalk/chalk) and built with modern JavaScript.
