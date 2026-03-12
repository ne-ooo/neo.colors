/**
 * Chainable color API
 * Implements chalk-style function-as-object pattern
 */

import type { StyleFunction, ColorLevel, ColorOptions, AnsiCode } from '../types.js'
import { styles, aliases, ansi256 as ansi256Code, rgb as rgbCode, styleNames } from './ansi-codes.js'
import { hexToRgb, rgbToAnsi256, rgbToAnsi16, clampRgb, isValidAnsi256 } from '../utils/convert.js'
import { getStdoutColorSupport } from './detect.js'

/**
 * Style stack entry
 */
interface StyleEntry {
  open: string
  close: string
}

/**
 * Create chainable color function
 */
export function createColors(options: ColorOptions = {}): StyleFunction {
  // Determine color level
  const level: ColorLevel = options.level !== undefined
    ? options.level
    : options.enabled === false
      ? 0
      : getStdoutColorSupport().level

  /**
   * Create new styled function with given style stack
   */
  function createStyled(currentStack: StyleEntry[]): StyleFunction {
    // Create the callable function
    const fn = ((text: string | number): string => {
      const str = String(text)
      if (level === 0 || !str) return str

      const openSeq = currentStack.map(s => s.open).join('')
      const closeSeq = currentStack.map(s => s.close).reverse().join('')

      if (str.includes('\n')) {
        return str.split('\n').map(line =>
          line ? openSeq + line + closeSeq : line
        ).join('\n')
      }

      return openSeq + str + closeSeq
    }) as StyleFunction

    // Set metadata
    fn.level = level

    // Add all style properties
    for (const name of styleNames) {
      Object.defineProperty(fn, name, {
        get() {
          const style = styles[name]
          return createStyled([...currentStack, style])
        },
        enumerable: true,
      })
    }

    // Add aliases
    for (const [aliasName, style] of Object.entries(aliases)) {
      Object.defineProperty(fn, aliasName, {
        get() {
          return createStyled([...currentStack, style])
        },
        enumerable: true,
      })
    }

    // Add dynamic color methods
    fn.rgb = (r: number, g: number, b: number): StyleFunction => {
      const [cr, cg, cb] = clampRgb(r, g, b)

      // Choose best color code based on level
      let code: AnsiCode
      if (level >= 3) {
        code = rgbCode(cr, cg, cb, false)
      } else if (level >= 2) {
        const ansi = rgbToAnsi256(cr, cg, cb)
        code = ansi256Code(ansi, false)
      } else if (level >= 1) {
        const ansi = rgbToAnsi16(cr, cg, cb)
        code = { open: `\u001B[${ansi}m`, close: '\u001B[39m' }
      } else {
        code = { open: '', close: '' }
      }

      return createStyled([...currentStack, code])
    }

    fn.hex = (color: string): StyleFunction => {
      try {
        const [r, g, b] = hexToRgb(color)
        return fn.rgb(r, g, b)
      } catch (error) {
        // Invalid hex, return unstyled
        return fn as StyleFunction
      }
    }

    fn.ansi256 = (code: number): StyleFunction => {
      if (!isValidAnsi256(code) || level < 2) {
        return fn as StyleFunction
      }
      return createStyled([...currentStack, ansi256Code(code, false)])
    }

    fn.bgRgb = (r: number, g: number, b: number): StyleFunction => {
      const [cr, cg, cb] = clampRgb(r, g, b)

      let code: AnsiCode
      if (level >= 3) {
        code = rgbCode(cr, cg, cb, true)
      } else if (level >= 2) {
        const ansi = rgbToAnsi256(cr, cg, cb)
        code = ansi256Code(ansi, true)
      } else if (level >= 1) {
        const ansi = rgbToAnsi16(cr, cg, cb)
        code = { open: `\u001B[${ansi + 10}m`, close: '\u001B[49m' }
      } else {
        code = { open: '', close: '' }
      }

      return createStyled([...currentStack, code])
    }

    fn.bgHex = (color: string): StyleFunction => {
      try {
        const [r, g, b] = hexToRgb(color)
        return fn.bgRgb(r, g, b)
      } catch (error) {
        return fn as StyleFunction
      }
    }

    fn.bgAnsi256 = (code: number): StyleFunction => {
      if (!isValidAnsi256(code) || level < 2) {
        return fn as StyleFunction
      }
      return createStyled([...currentStack, ansi256Code(code, true)])
    }

    return fn
  }

  // Create root function (no styles yet) - start with empty stack
  return createStyled([])
}
