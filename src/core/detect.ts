/**
 * Terminal color support detection
 * Zero-dependency implementation (inline supports-color + has-flag)
 */

import type { ColorLevel, ColorSupport } from '../types.js'
import { platform } from 'node:process'
import { isatty } from 'node:tty'

/**
 * Parse --color flag value
 */
function parseColorFlag(): ColorLevel | undefined {
  const colorIndex = process.argv.findIndex(arg => arg.startsWith('--color'))
  if (colorIndex === -1) return undefined

  const arg = process.argv[colorIndex]!

  // --no-color or --color=false
  if (arg === '--no-color' || arg === '--color=false' || arg === '--color=never') {
    return 0
  }

  // --color or --color=true
  if (arg === '--color' || arg === '--color=true' || arg === '--color=always') {
    return 1
  }

  // --color=256
  if (arg === '--color=256') {
    return 2
  }

  // --color=16m or --color=full or --color=truecolor
  if (arg === '--color=16m' || arg === '--color=full' || arg === '--color=truecolor') {
    return 3
  }

  return undefined
}

/**
 * Get Windows build version
 */
function getWindowsVersion(): number {
  const release = platform === 'win32' ? process.env['OS_RELEASE'] || '' : ''
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(release)
  if (!match) return 0
  return parseInt(match[1]!, 10) * 10000 + parseInt(match[2]!, 10) * 100 + parseInt(match[3]!, 10)
}

/**
 * Detect CI environment
 */
function isCI(): boolean {
  return Boolean(
    process.env['CI'] || // Generic CI
    process.env['CONTINUOUS_INTEGRATION'] || // Travis
    process.env['BUILD_NUMBER'] || // Jenkins, TeamCity
    process.env['RUN_ID'] // GitHub Actions
  )
}

/**
 * Detect terminal color support level
 */
export function detectColorSupport(stream?: NodeJS.WriteStream): ColorSupport {
  const target = stream || process.stdout
  let level: ColorLevel = 0

  // 1. Check CLI flags (highest priority)
  const flagLevel = parseColorFlag()
  if (flagLevel !== undefined) {
    level = flagLevel
  } else {
    // 2. Check FORCE_COLOR environment variable
    if ('FORCE_COLOR' in process.env) {
      const force = process.env['FORCE_COLOR']
      if (force === 'true' || force === '') {
        level = 1
      } else if (force === 'false') {
        level = 0
      } else if (force) {
        const num = parseInt(force, 10)
        level = (isNaN(num) ? 1 : Math.min(3, Math.max(0, num))) as ColorLevel
      }
    }
    // 3. Check NO_COLOR
    else if ('NO_COLOR' in process.env) {
      level = 0
    }
    // 4. Check TERM=dumb (explicit disable)
    else if (process.env['TERM'] === 'dumb') {
      level = 0
    }
    // 5. Check COLORTERM for truecolor
    else if (process.env['COLORTERM'] === 'truecolor' || process.env['COLORTERM'] === '24bit') {
      level = 3
    }
    // 6. Check TERM value
    else if (process.env['TERM']) {
      if (/-256(color)?$/i.test(process.env['TERM'])) {
        level = 2
      } else if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(process.env['TERM'])) {
        level = 1
      }
    }
    // 7. Check terminal program
    else if (process.env['TERM_PROGRAM']) {
      const version = parseInt((process.env['TERM_PROGRAM_VERSION'] || '').split('.')[0]!, 10) || 0

      switch (process.env['TERM_PROGRAM']) {
        case 'iTerm.app':
          level = version >= 3 ? 3 : 2
          break
        case 'Apple_Terminal':
          level = 2
          break
        case 'Hyper':
          level = 3
          break
        case 'Terminus':
          level = 3
          break
        default:
          level = 1
      }
    }
    // 8. Platform-specific detection
    else if (platform === 'win32') {
      // Windows 10 build 10586 added 256-color support
      // Windows 10 build 14931 added truecolor support
      const winVersion = getWindowsVersion()
      level = winVersion >= 14931 ? 3 : winVersion >= 10586 ? 2 : 1
    }
    // 9. Check CI environments
    else if (isCI()) {
      level = 1
    }
    // 10. Check if TTY (fallback)
    else if (!target.isTTY && !isatty(1)) {
      level = 0
    }
  }

  return {
    level,
    hasBasic: level >= 1,
    has256: level >= 2,
    has16m: level >= 3,
  }
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
