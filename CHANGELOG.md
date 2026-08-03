# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Fixed

- Preserve outer styles around nested or pre-styled ANSI content
- Respect `--no-color` and disable automatic colors for piped streams
- Use stream-specific TTY detection and real Windows build detection
- Return the chainable callable from native CommonJS `require()`
- Cache static and dynamic style branches to eliminate per-call API reconstruction
- Upgrade and lock the development toolchain with an audit-clean dependency graph
- Convert RGB to the nearest ANSI16 palette entry, including tied secondary colors
- Normalize `NaN` and infinite RGB channels before generating escape sequences
- Support Chalk-compatible zero, single, and multiple argument calls
- Make `level` updates propagate through every cached style branch
- Reject inherited object properties when resolving internal style names
- Include generated source maps and linked documentation in the published package
- Align release documentation with the package's `1.0.0` version

### Changed

- Benchmark forced, equivalent color levels and report reproducible results
- Enforce linting, coverage thresholds, package type checks, and ESM/CJS smoke tests before publish
- Move named exports onto lightweight implementations with enforced bundle-size regression checks
- Add `sanitizeText()` for user-controlled terminal output

## [1.0.0] - 2026-03-09

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
