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
export { sanitizeText } from './utils/sanitize.js'

// Default instance (auto-detect terminal)
const colors = /* @__PURE__ */ createColors()

// Export default instance
export default colors

// Lightweight named exports do not retain the chainable default instance.
export {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  grey,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgGray,
  bgGrey,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  rgb,
  hex,
  ansi256,
  bgRgb,
  bgHex,
  bgAnsi256,
} from './core/direct.js'
