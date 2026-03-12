/**
 * @lpm.dev/neo.colors
 * Zero-dependency terminal colors
 */

import { createColors } from './core/chain.js'

// Export types
export type { StyleFunction, ColorSupport, ColorLevel, ColorOptions, AnsiCode } from './types.js'

// Export utilities
export { createColors }
export { detectColorSupport, getStdoutColorSupport, getStderrColorSupport } from './core/detect.js'

// Default instance (auto-detect terminal)
const colors = createColors()

// Export default instance
export default colors

// Named exports for individual styles (tree-shakeable)
export const reset = (text: string) => colors.reset(text)
export const bold = (text: string) => colors.bold(text)
export const dim = (text: string) => colors.dim(text)
export const italic = (text: string) => colors.italic(text)
export const underline = (text: string) => colors.underline(text)
export const inverse = (text: string) => colors.inverse(text)
export const hidden = (text: string) => colors.hidden(text)
export const strikethrough = (text: string) => colors.strikethrough(text)

export const black = (text: string) => colors.black(text)
export const red = (text: string) => colors.red(text)
export const green = (text: string) => colors.green(text)
export const yellow = (text: string) => colors.yellow(text)
export const blue = (text: string) => colors.blue(text)
export const magenta = (text: string) => colors.magenta(text)
export const cyan = (text: string) => colors.cyan(text)
export const white = (text: string) => colors.white(text)
export const gray = (text: string) => colors.gray(text)
export const grey = (text: string) => colors.grey(text)

export const blackBright = (text: string) => colors.blackBright(text)
export const redBright = (text: string) => colors.redBright(text)
export const greenBright = (text: string) => colors.greenBright(text)
export const yellowBright = (text: string) => colors.yellowBright(text)
export const blueBright = (text: string) => colors.blueBright(text)
export const magentaBright = (text: string) => colors.magentaBright(text)
export const cyanBright = (text: string) => colors.cyanBright(text)
export const whiteBright = (text: string) => colors.whiteBright(text)

export const bgBlack = (text: string) => colors.bgBlack(text)
export const bgRed = (text: string) => colors.bgRed(text)
export const bgGreen = (text: string) => colors.bgGreen(text)
export const bgYellow = (text: string) => colors.bgYellow(text)
export const bgBlue = (text: string) => colors.bgBlue(text)
export const bgMagenta = (text: string) => colors.bgMagenta(text)
export const bgCyan = (text: string) => colors.bgCyan(text)
export const bgWhite = (text: string) => colors.bgWhite(text)
export const bgGray = (text: string) => colors.bgGray(text)
export const bgGrey = (text: string) => colors.bgGrey(text)

export const bgBlackBright = (text: string) => colors.bgBlackBright(text)
export const bgRedBright = (text: string) => colors.bgRedBright(text)
export const bgGreenBright = (text: string) => colors.bgGreenBright(text)
export const bgYellowBright = (text: string) => colors.bgYellowBright(text)
export const bgBlueBright = (text: string) => colors.bgBlueBright(text)
export const bgMagentaBright = (text: string) => colors.bgMagentaBright(text)
export const bgCyanBright = (text: string) => colors.bgCyanBright(text)
export const bgWhiteBright = (text: string) => colors.bgWhiteBright(text)

// Dynamic color functions
export const rgb = (r: number, g: number, b: number) => (text: string) => colors.rgb(r, g, b)(text)
export const hex = (color: string) => (text: string) => colors.hex(color)(text)
export const ansi256 = (code: number) => (text: string) => colors.ansi256(code)(text)

export const bgRgb = (r: number, g: number, b: number) => (text: string) => colors.bgRgb(r, g, b)(text)
export const bgHex = (color: string) => (text: string) => colors.bgHex(color)(text)
export const bgAnsi256 = (code: number) => (text: string) => colors.bgAnsi256(code)(text)
