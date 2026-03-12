# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - 2026-03-09

### Added

- Default `colors` instance with auto-detected terminal color support
- Full chalk-compatible chaining API: `colors.red.bold('text')`, `colors.green.underline('text')`, etc.
- 8 standard foreground colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
- 8 bright foreground colors: `blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`
- `gray`/`grey` aliases
- 8 standard + 8 bright background colors (`bgBlack`, `bgRed`, etc.)
- Style modifiers: `bold`, `dim`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `reset`
- RGB color support: `colors.rgb(255, 0, 0)('text')`, `colors.bgRgb(r, g, b)('text')`
- Hex color support: `colors.hex('#ff0000')('text')`, `colors.bgHex('#color')('text')`, shorthand `#f00`
- 256-color palette: `colors.ansi256(196)('text')`, `colors.bgAnsi256(code)('text')`
- `createColors(options?)` — create custom instances with forced color level or disabled output
- `detectColorSupport()` — detect terminal color capabilities (level 0-3)
- `getStdoutColorSupport()` / `getStderrColorSupport()` — stream-specific detection
- Tree-shakeable named exports for all colors and styles
- Environment variable support: `NO_COLOR`, `FORCE_COLOR` (levels 1-3)
- CLI flag support: `--color`, `--no-color`, `--color=256`, `--color=16m`
- Auto-detection for CI environments (GitHub Actions, Travis, Jenkins, etc.)
- Zero runtime dependencies
- ESM + CJS dual output with TypeScript types
