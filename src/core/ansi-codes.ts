/**
 * ANSI escape codes for terminal styling
 * Zero-dependency implementation (inline ansi-styles)
 */

import type { AnsiCode } from '../types.js'

/**
 * All ANSI style codes
 */
export const styles = {
  // Modifiers
  reset: { open: '\u001B[0m', close: '\u001B[0m' },
  bold: { open: '\u001B[1m', close: '\u001B[22m' },
  dim: { open: '\u001B[2m', close: '\u001B[22m' },
  italic: { open: '\u001B[3m', close: '\u001B[23m' },
  underline: { open: '\u001B[4m', close: '\u001B[24m' },
  inverse: { open: '\u001B[7m', close: '\u001B[27m' },
  hidden: { open: '\u001B[8m', close: '\u001B[28m' },
  strikethrough: { open: '\u001B[9m', close: '\u001B[29m' },

  // Foreground colors (30-37)
  black: { open: '\u001B[30m', close: '\u001B[39m' },
  red: { open: '\u001B[31m', close: '\u001B[39m' },
  green: { open: '\u001B[32m', close: '\u001B[39m' },
  yellow: { open: '\u001B[33m', close: '\u001B[39m' },
  blue: { open: '\u001B[34m', close: '\u001B[39m' },
  magenta: { open: '\u001B[35m', close: '\u001B[39m' },
  cyan: { open: '\u001B[36m', close: '\u001B[39m' },
  white: { open: '\u001B[37m', close: '\u001B[39m' },

  // Bright foreground colors (90-97)
  blackBright: { open: '\u001B[90m', close: '\u001B[39m' },
  redBright: { open: '\u001B[91m', close: '\u001B[39m' },
  greenBright: { open: '\u001B[92m', close: '\u001B[39m' },
  yellowBright: { open: '\u001B[93m', close: '\u001B[39m' },
  blueBright: { open: '\u001B[94m', close: '\u001B[39m' },
  magentaBright: { open: '\u001B[95m', close: '\u001B[39m' },
  cyanBright: { open: '\u001B[96m', close: '\u001B[39m' },
  whiteBright: { open: '\u001B[97m', close: '\u001B[39m' },

  // Background colors (40-47)
  bgBlack: { open: '\u001B[40m', close: '\u001B[49m' },
  bgRed: { open: '\u001B[41m', close: '\u001B[49m' },
  bgGreen: { open: '\u001B[42m', close: '\u001B[49m' },
  bgYellow: { open: '\u001B[43m', close: '\u001B[49m' },
  bgBlue: { open: '\u001B[44m', close: '\u001B[49m' },
  bgMagenta: { open: '\u001B[45m', close: '\u001B[49m' },
  bgCyan: { open: '\u001B[46m', close: '\u001B[49m' },
  bgWhite: { open: '\u001B[47m', close: '\u001B[49m' },

  // Bright background colors (100-107)
  bgBlackBright: { open: '\u001B[100m', close: '\u001B[49m' },
  bgRedBright: { open: '\u001B[101m', close: '\u001B[49m' },
  bgGreenBright: { open: '\u001B[102m', close: '\u001B[49m' },
  bgYellowBright: { open: '\u001B[103m', close: '\u001B[49m' },
  bgBlueBright: { open: '\u001B[104m', close: '\u001B[49m' },
  bgMagentaBright: { open: '\u001B[105m', close: '\u001B[49m' },
  bgCyanBright: { open: '\u001B[106m', close: '\u001B[49m' },
  bgWhiteBright: { open: '\u001B[107m', close: '\u001B[49m' },
} as const

// Aliases
export const aliases = {
  gray: styles.blackBright,
  grey: styles.blackBright,
  bgGray: styles.bgBlackBright,
  bgGrey: styles.bgBlackBright,
} as const

/**
 * Create ANSI code for 256-color palette
 */
export function ansi256(code: number, background = false): AnsiCode {
  const prefix = background ? 48 : 38
  return {
    open: `\u001B[${prefix};5;${code}m`,
    close: `\u001B[${background ? 49 : 39}m`,
  }
}

/**
 * Create ANSI code for RGB color (truecolor)
 */
export function rgb(r: number, g: number, b: number, background = false): AnsiCode {
  const prefix = background ? 48 : 38
  return {
    open: `\u001B[${prefix};2;${r};${g};${b}m`,
    close: `\u001B[${background ? 49 : 39}m`,
  }
}

/**
 * Get all style names
 */
export const styleNames = Object.keys(styles) as Array<keyof typeof styles>

/**
 * Check if a style name exists
 */
export function isStyleName(name: string): name is keyof typeof styles {
  return name in styles || name in aliases
}

/**
 * Get style by name (including aliases)
 */
export function getStyle(name: string): AnsiCode | undefined {
  if (name in aliases) {
    return aliases[name as keyof typeof aliases]
  }
  if (name in styles) {
    return styles[name as keyof typeof styles]
  }
  return undefined
}
