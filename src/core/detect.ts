/**
 * Terminal color support detection
 * Zero-dependency implementation (inline supports-color + has-flag)
 */

import type { ColorLevel, ColorSupport } from '../types.js'
import { platform } from 'node:process'
import { release } from 'node:os'

/**
 * Parse --color flag value
 */
function parseColorFlag(): ColorLevel | undefined {
  let level: ColorLevel | undefined

  // Process every exact flag so similarly named application options do not
  // mask a later color flag. When flags conflict, the last one wins.
  for (const arg of process.argv.slice(2)) {
    if (arg === '--no-color' || arg === '--color=false' || arg === '--color=never') {
      level = 0
    } else if (arg === '--color' || arg === '--color=true' || arg === '--color=always') {
      level = 1
    } else if (arg === '--color=256') {
      level = 2
    } else if (arg === '--color=16m' || arg === '--color=full' || arg === '--color=truecolor') {
      level = 3
    }
  }

  return level
}

/**
 * Get Windows build version
 */
function getWindowsBuild(): number {
  if (platform !== 'win32') return 0

  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(release())
  if (!match) return 0

  const major = parseInt(match[1]!, 10)
  return major >= 10 ? parseInt(match[3]!, 10) : 0
}

/**
 * Detect CI environment
 */
function isCI(): boolean {
  const indicators = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'BUILD_NUMBER',
    'RUN_ID',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'BUILDKITE',
    'CIRCLECI',
    'TRAVIS',
    'APPVEYOR',
    'TF_BUILD',
  ]

  return indicators.some(name => {
    const value = process.env[name]
    return value !== undefined && value !== '' && value !== 'false' && value !== '0'
  })
}

/**
 * Check the actual target stream rather than always consulting stdout.
 */
function isStreamTTY(stream: NodeJS.WriteStream): boolean {
  return stream.isTTY === true
}

/**
 * Detect support advertised by a known terminal program.
 */
function getTerminalProgramLevel(): ColorLevel | undefined {
  const program = process.env['TERM_PROGRAM']
  if (!program) return undefined

  const version = parseInt((process.env['TERM_PROGRAM_VERSION'] || '').split('.')[0]!, 10) || 0

  switch (program) {
    case 'iTerm.app':
      return version >= 3 ? 3 : 2
    case 'Apple_Terminal':
      return 2
    case 'Hyper':
    case 'Terminus':
    case 'vscode':
    case 'WezTerm':
    case 'WarpTerminal':
      return 3
    default:
      return 1
  }
}

function createColorSupport(level: ColorLevel): ColorSupport {
  return {
    level,
    hasBasic: level >= 1,
    has256: level >= 2,
    has16m: level >= 3,
  }
}

/**
 * Detect terminal color support level
 */
export function detectColorSupport(stream?: NodeJS.WriteStream): ColorSupport {
  const target = stream ?? process.stdout

  // 1. Check CLI flags (highest priority)
  const flagLevel = parseColorFlag()
  if (flagLevel !== undefined) {
    return createColorSupport(flagLevel)
  }

  // 2. FORCE_COLOR explicitly overrides TTY capability and NO_COLOR.
  if ('FORCE_COLOR' in process.env) {
    const force = process.env['FORCE_COLOR']
    if (force === 'false' || force === '0') return createColorSupport(0)
    if (force === 'true' || force === '' || force === undefined) return createColorSupport(1)

    const numericLevel = Number.parseInt(force, 10)
    const level = (Number.isNaN(numericLevel)
      ? 1
      : Math.min(3, Math.max(0, numericLevel))) as ColorLevel
    return createColorSupport(level)
  }

  // 3. Explicit environment and terminal opt-outs.
  if ('NO_COLOR' in process.env || process.env['TERM'] === 'dumb') {
    return createColorSupport(0)
  }

  // 4. Capability variables describe the terminal, not whether this stream is
  // connected to it. Piped/redirected streams must remain plain by default.
  if (!isStreamTTY(target)) {
    return createColorSupport(0)
  }

  // A real TTY supports at least the basic ANSI palette.
  let level: ColorLevel = 1

  if (platform === 'win32') {
    // Windows 10 build 10586 added 256-color support; 14931 added truecolor.
    const build = getWindowsBuild()
    level = build >= 14931 ? 3 : build >= 10586 ? 2 : 1
  }

  if (isCI()) {
    level = Math.max(level, 1) as ColorLevel
  }

  const terminalProgramLevel = getTerminalProgramLevel()
  if (terminalProgramLevel !== undefined) {
    level = Math.max(level, terminalProgramLevel) as ColorLevel
  }

  const term = process.env['TERM']
  if (term && /256(color)?$/i.test(term)) {
    level = Math.max(level, 2) as ColorLevel
  }

  const colorTerm = process.env['COLORTERM']?.toLowerCase()
  if (colorTerm === 'truecolor' || colorTerm === '24bit') {
    level = 3
  }

  return createColorSupport(level)
}

/**
 * Cached detection result for stdout
 */
let stdoutCache: ColorSupport | null = null

/**
 * Get color support for stdout (cached)
 */
export function getStdoutColorSupport(): ColorSupport {
  if (!stdoutCache) {
    stdoutCache = detectColorSupport(process.stdout)
  }
  return stdoutCache
}

/**
 * Cached detection result for stderr
 */
let stderrCache: ColorSupport | null = null

/**
 * Get color support for stderr (cached)
 */
export function getStderrColorSupport(): ColorSupport {
  if (!stderrCache) {
    stderrCache = detectColorSupport(process.stderr)
  }
  return stderrCache
}

/**
 * Clear cached detection results (for testing)
 */
export function clearCache(): void {
  stdoutCache = null
  stderrCache = null
}
