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

function validateColorLevel(value: unknown): ColorLevel {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value
  throw new RangeError(`Color level must be 0, 1, 2, or 3; received ${String(value)}`)
}

/**
 * Create chainable color function
 */
export function createColors(options: ColorOptions = {}): StyleFunction {
  // Determine color level
  const initialLevel: ColorLevel = options.level !== undefined
    ? validateColorLevel(options.level)
    : options.enabled === false
      ? 0
      : getStdoutColorSupport().level
  const state = { level: initialLevel }

  /**
   * Create new styled function with given style stack
   */
  function createStyled(currentStack: StyleEntry[]): StyleFunction {
    const openSeq = currentStack.map(style => style.open).join('')
    const closeSeq = currentStack.map(style => style.close).reverse().join('')
    const reopenStack = [...currentStack].reverse()
    const staticStyleCache = new Map<string, StyleFunction>()
    const dynamicStyleCache = new Map<string, StyleFunction>()

    // Create the callable function
    const fn = ((...values: unknown[]): string => {
      // Keep the single-argument path inline; it dominates colorized logging.
      const str = values.length === 1
        ? String(values[0])
        : values.length === 0
          ? ''
          : values.join(' ')
      if (state.level === 0 || !str) return str
      if (currentStack.length === 0) return str

      let styledText = str

      // Reopen styles that the input closes. This preserves an outer style
      // around nested/pre-styled content, matching chalk's nesting semantics.
      if (styledText.includes('\u001B')) {
        for (const style of reopenStack) {
          if (style.close && styledText.includes(style.close)) {
            styledText = styledText.split(style.close).join(style.close + style.open)
          }
        }
      }

      // Close before a line break and reopen afterwards to avoid color bleed.
      if (styledText.includes('\n')) {
        styledText = styledText.replace(/\r?\n/g, newline => closeSeq + newline + openSeq)
      }

      return openSeq + styledText + closeSeq
    }) as StyleFunction

    // Every branch shares the same mutable level, matching chalk instances.
    Object.defineProperty(fn, 'level', {
      get() {
        return state.level
      },
      set(value: ColorLevel) {
        state.level = validateColorLevel(value)
      },
      enumerable: true,
    })

    const withStaticStyle = (style: StyleEntry): StyleFunction => {
      const key = `${style.open}\u0000${style.close}`
      const cached = staticStyleCache.get(key)
      if (cached) return cached

      const child = createStyled([...currentStack, style])
      staticStyleCache.set(key, child)
      return child
    }

    const withDynamicStyle = (code: AnsiCode): StyleFunction => {
      if (state.level === 0 || !code.open) return fn

      const key = `${code.open}\u0000${code.close}`
      const cached = dynamicStyleCache.get(key)
      if (cached) return cached

      const child = createStyled([...currentStack, code])
      dynamicStyleCache.set(key, child)
      return child
    }

    // Add all style properties
    for (const name of styleNames) {
      Object.defineProperty(fn, name, {
        get() {
          const child = withStaticStyle(styles[name])
          Object.defineProperty(fn, name, {
            value: child,
            enumerable: true,
          })
          return child
        },
        enumerable: true,
        configurable: true,
      })
    }

    // Add aliases
    for (const [aliasName, style] of Object.entries(aliases)) {
      Object.defineProperty(fn, aliasName, {
        get() {
          const child = withStaticStyle(style)
          Object.defineProperty(fn, aliasName, {
            value: child,
            enumerable: true,
          })
          return child
        },
        enumerable: true,
        configurable: true,
      })
    }

    // Add dynamic color methods
    fn.rgb = (r: number, g: number, b: number): StyleFunction => {
      const [cr, cg, cb] = clampRgb(r, g, b)

      // Choose best color code based on level
      let code: AnsiCode
      if (state.level >= 3) {
        code = rgbCode(cr, cg, cb, false)
      } else if (state.level >= 2) {
        const ansi = rgbToAnsi256(cr, cg, cb)
        code = ansi256Code(ansi, false)
      } else if (state.level >= 1) {
        const ansi = rgbToAnsi16(cr, cg, cb)
        code = { open: `\u001B[${ansi}m`, close: '\u001B[39m' }
      } else {
        code = { open: '', close: '' }
      }

      return withDynamicStyle(code)
    }

    fn.hex = (color: string): StyleFunction => {
      try {
        const [r, g, b] = hexToRgb(color)
        return fn.rgb(r, g, b)
      } catch {
        // Invalid hex, return unstyled
        return fn as StyleFunction
      }
    }

    fn.ansi256 = (code: number): StyleFunction => {
      if (!isValidAnsi256(code) || state.level < 2) {
        return fn as StyleFunction
      }
      return withDynamicStyle(ansi256Code(code, false))
    }

    fn.bgRgb = (r: number, g: number, b: number): StyleFunction => {
      const [cr, cg, cb] = clampRgb(r, g, b)

      let code: AnsiCode
      if (state.level >= 3) {
        code = rgbCode(cr, cg, cb, true)
      } else if (state.level >= 2) {
        const ansi = rgbToAnsi256(cr, cg, cb)
        code = ansi256Code(ansi, true)
      } else if (state.level >= 1) {
        const ansi = rgbToAnsi16(cr, cg, cb)
        code = { open: `\u001B[${ansi + 10}m`, close: '\u001B[49m' }
      } else {
        code = { open: '', close: '' }
      }

      return withDynamicStyle(code)
    }

    fn.bgHex = (color: string): StyleFunction => {
      try {
        const [r, g, b] = hexToRgb(color)
        return fn.bgRgb(r, g, b)
      } catch {
        return fn as StyleFunction
      }
    }

    fn.bgAnsi256 = (code: number): StyleFunction => {
      if (!isValidAnsi256(code) || state.level < 2) {
        return fn as StyleFunction
      }
      return withDynamicStyle(ansi256Code(code, true))
    }

    return fn
  }

  // Create root function (no styles yet) - start with empty stack
  return createStyled([])
}
