/**
 * Type definitions for @lpm.dev/neo.colors
 */

/**
 * ANSI code pair (open and close sequences)
 */
export interface AnsiCode {
  open: string
  close: string
}

/**
 * Color support level
 * - 0: No color support
 * - 1: Basic 16 colors
 * - 2: 256 colors
 * - 3: Truecolor (16 million colors)
 */
export type ColorLevel = 0 | 1 | 2 | 3

/**
 * Color support detection result
 */
export interface ColorSupport {
  level: ColorLevel
  hasBasic: boolean
  has256: boolean
  has16m: boolean
}

/**
 * Options for creating color instance
 */
export interface ColorOptions {
  level?: ColorLevel
  enabled?: boolean
}

/**
 * Style function that can be chained
 */
export interface StyleFunction {
  (text: string | number): string

  // Modifiers
  readonly reset: StyleFunction
  readonly bold: StyleFunction
  readonly dim: StyleFunction
  readonly italic: StyleFunction
  readonly underline: StyleFunction
  readonly inverse: StyleFunction
  readonly hidden: StyleFunction
  readonly strikethrough: StyleFunction

  // Foreground colors
  readonly black: StyleFunction
  readonly red: StyleFunction
  readonly green: StyleFunction
  readonly yellow: StyleFunction
  readonly blue: StyleFunction
  readonly magenta: StyleFunction
  readonly cyan: StyleFunction
  readonly white: StyleFunction
  readonly gray: StyleFunction
  readonly grey: StyleFunction

  // Bright foreground colors
  readonly blackBright: StyleFunction
  readonly redBright: StyleFunction
  readonly greenBright: StyleFunction
  readonly yellowBright: StyleFunction
  readonly blueBright: StyleFunction
  readonly magentaBright: StyleFunction
  readonly cyanBright: StyleFunction
  readonly whiteBright: StyleFunction

  // Background colors
  readonly bgBlack: StyleFunction
  readonly bgRed: StyleFunction
  readonly bgGreen: StyleFunction
  readonly bgYellow: StyleFunction
  readonly bgBlue: StyleFunction
  readonly bgMagenta: StyleFunction
  readonly bgCyan: StyleFunction
  readonly bgWhite: StyleFunction
  readonly bgGray: StyleFunction
  readonly bgGrey: StyleFunction

  // Bright background colors
  readonly bgBlackBright: StyleFunction
  readonly bgRedBright: StyleFunction
  readonly bgGreenBright: StyleFunction
  readonly bgYellowBright: StyleFunction
  readonly bgBlueBright: StyleFunction
  readonly bgMagentaBright: StyleFunction
  readonly bgCyanBright: StyleFunction
  readonly bgWhiteBright: StyleFunction

  // Dynamic colors
  rgb(r: number, g: number, b: number): StyleFunction
  hex(color: string): StyleFunction
  ansi256(code: number): StyleFunction

  bgRgb(r: number, g: number, b: number): StyleFunction
  bgHex(color: string): StyleFunction
  bgAnsi256(code: number): StyleFunction

  // Metadata
  level: ColorLevel
}
