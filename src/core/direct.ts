/**
 * Lightweight named style functions.
 *
 * These intentionally do not depend on the chainable default instance, so a
 * bundler can retain one named color without pulling in the full chain API.
 */

import type { AnsiCode } from '../types.js'
import { getStdoutColorSupport } from './detect.js'
import { clampRgb, hexToRgb, isValidAnsi256, rgbToAnsi16, rgbToAnsi256 } from '../utils/convert.js'
import { formatArguments } from '../utils/format.js'

type NamedStyle = (...values: unknown[]) => string

function ansi256Code(code: number, background: boolean): AnsiCode {
  return {
    open: `\u001B[${background ? 48 : 38};5;${code}m`,
    close: `\u001B[${background ? 49 : 39}m`,
  }
}

function rgbCode(r: number, g: number, b: number, background: boolean): AnsiCode {
  return {
    open: `\u001B[${background ? 48 : 38};2;${r};${g};${b}m`,
    close: `\u001B[${background ? 49 : 39}m`,
  }
}

function applyCode(
  code: AnsiCode,
  values: readonly unknown[],
  level = getStdoutColorSupport().level
): string {
  const text = formatArguments(values)
  if (level === 0 || !text || !code.open) return text

  let styledText = text
  if (styledText.includes(code.close)) {
    styledText = styledText.split(code.close).join(code.close + code.open)
  }
  if (styledText.includes('\n')) {
    styledText = styledText.replace(/\r?\n/g, newline => code.close + newline + code.open)
  }

  return code.open + styledText + code.close
}

function plainStyle(...values: unknown[]): string {
  return formatArguments(values)
}

export function reset(...values: unknown[]): string {
  return applyCode({ open: '\u001B[0m', close: '\u001B[0m' }, values)
}

export function bold(...values: unknown[]): string {
  return applyCode({ open: '\u001B[1m', close: '\u001B[22m' }, values)
}

export function dim(...values: unknown[]): string {
  return applyCode({ open: '\u001B[2m', close: '\u001B[22m' }, values)
}

export function italic(...values: unknown[]): string {
  return applyCode({ open: '\u001B[3m', close: '\u001B[23m' }, values)
}

export function underline(...values: unknown[]): string {
  return applyCode({ open: '\u001B[4m', close: '\u001B[24m' }, values)
}

export function inverse(...values: unknown[]): string {
  return applyCode({ open: '\u001B[7m', close: '\u001B[27m' }, values)
}

export function hidden(...values: unknown[]): string {
  return applyCode({ open: '\u001B[8m', close: '\u001B[28m' }, values)
}

export function strikethrough(...values: unknown[]): string {
  return applyCode({ open: '\u001B[9m', close: '\u001B[29m' }, values)
}

export function black(...values: unknown[]): string {
  return applyCode({ open: '\u001B[30m', close: '\u001B[39m' }, values)
}

export function red(...values: unknown[]): string {
  return applyCode({ open: '\u001B[31m', close: '\u001B[39m' }, values)
}

export function green(...values: unknown[]): string {
  return applyCode({ open: '\u001B[32m', close: '\u001B[39m' }, values)
}

export function yellow(...values: unknown[]): string {
  return applyCode({ open: '\u001B[33m', close: '\u001B[39m' }, values)
}

export function blue(...values: unknown[]): string {
  return applyCode({ open: '\u001B[34m', close: '\u001B[39m' }, values)
}

export function magenta(...values: unknown[]): string {
  return applyCode({ open: '\u001B[35m', close: '\u001B[39m' }, values)
}

export function cyan(...values: unknown[]): string {
  return applyCode({ open: '\u001B[36m', close: '\u001B[39m' }, values)
}

export function white(...values: unknown[]): string {
  return applyCode({ open: '\u001B[37m', close: '\u001B[39m' }, values)
}

export function blackBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[90m', close: '\u001B[39m' }, values)
}

export function gray(...values: unknown[]): string {
  return blackBright(...values)
}

export function grey(...values: unknown[]): string {
  return blackBright(...values)
}

export function redBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[91m', close: '\u001B[39m' }, values)
}

export function greenBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[92m', close: '\u001B[39m' }, values)
}

export function yellowBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[93m', close: '\u001B[39m' }, values)
}

export function blueBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[94m', close: '\u001B[39m' }, values)
}

export function magentaBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[95m', close: '\u001B[39m' }, values)
}

export function cyanBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[96m', close: '\u001B[39m' }, values)
}

export function whiteBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[97m', close: '\u001B[39m' }, values)
}

export function bgBlack(...values: unknown[]): string {
  return applyCode({ open: '\u001B[40m', close: '\u001B[49m' }, values)
}

export function bgRed(...values: unknown[]): string {
  return applyCode({ open: '\u001B[41m', close: '\u001B[49m' }, values)
}

export function bgGreen(...values: unknown[]): string {
  return applyCode({ open: '\u001B[42m', close: '\u001B[49m' }, values)
}

export function bgYellow(...values: unknown[]): string {
  return applyCode({ open: '\u001B[43m', close: '\u001B[49m' }, values)
}

export function bgBlue(...values: unknown[]): string {
  return applyCode({ open: '\u001B[44m', close: '\u001B[49m' }, values)
}

export function bgMagenta(...values: unknown[]): string {
  return applyCode({ open: '\u001B[45m', close: '\u001B[49m' }, values)
}

export function bgCyan(...values: unknown[]): string {
  return applyCode({ open: '\u001B[46m', close: '\u001B[49m' }, values)
}

export function bgWhite(...values: unknown[]): string {
  return applyCode({ open: '\u001B[47m', close: '\u001B[49m' }, values)
}

export function bgBlackBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[100m', close: '\u001B[49m' }, values)
}

export function bgGray(...values: unknown[]): string {
  return bgBlackBright(...values)
}

export function bgGrey(...values: unknown[]): string {
  return bgBlackBright(...values)
}

export function bgRedBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[101m', close: '\u001B[49m' }, values)
}

export function bgGreenBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[102m', close: '\u001B[49m' }, values)
}

export function bgYellowBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[103m', close: '\u001B[49m' }, values)
}

export function bgBlueBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[104m', close: '\u001B[49m' }, values)
}

export function bgMagentaBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[105m', close: '\u001B[49m' }, values)
}

export function bgCyanBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[106m', close: '\u001B[49m' }, values)
}

export function bgWhiteBright(...values: unknown[]): string {
  return applyCode({ open: '\u001B[107m', close: '\u001B[49m' }, values)
}

function dynamicRgb(r: number, g: number, b: number, background: boolean): NamedStyle {
  const level = getStdoutColorSupport().level
  const [cr, cg, cb] = clampRgb(r, g, b)
  let code: AnsiCode

  if (level >= 3) {
    code = rgbCode(cr, cg, cb, background)
  } else if (level >= 2) {
    code = ansi256Code(rgbToAnsi256(cr, cg, cb), background)
  } else if (level >= 1) {
    const ansi = rgbToAnsi16(cr, cg, cb)
    code = {
      open: `\u001B[${background ? ansi + 10 : ansi}m`,
      close: `\u001B[${background ? 49 : 39}m`,
    }
  } else {
    return plainStyle
  }

  return (...values: unknown[]) => applyCode(code, values, level)
}

export function rgb(r: number, g: number, b: number): NamedStyle {
  return dynamicRgb(r, g, b, false)
}

export function bgRgb(r: number, g: number, b: number): NamedStyle {
  return dynamicRgb(r, g, b, true)
}

export function hex(color: string): NamedStyle {
  try {
    return rgb(...hexToRgb(color))
  } catch {
    return plainStyle
  }
}

export function bgHex(color: string): NamedStyle {
  try {
    return bgRgb(...hexToRgb(color))
  } catch {
    return plainStyle
  }
}

export function ansi256(code: number): NamedStyle {
  const level = getStdoutColorSupport().level
  if (level < 2 || !isValidAnsi256(code)) return plainStyle
  const style = ansi256Code(code, false)
  return (...values: unknown[]) => applyCode(style, values, level)
}

export function bgAnsi256(code: number): NamedStyle {
  const level = getStdoutColorSupport().level
  if (level < 2 || !isValidAnsi256(code)) return plainStyle
  const style = ansi256Code(code, true)
  return (...values: unknown[]) => applyCode(style, values, level)
}
