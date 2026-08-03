/**
 * Chainable API tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createColors } from '../../src/core/chain.js'

describe('Chainable API', () => {
  describe('Basic colors', () => {
    it('should apply red color', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red('text')
      expect(result).toContain('\u001B[31m')
      expect(result).toContain('text')
      expect(result).toContain('\u001B[39m')
    })

    it('should apply green color', () => {
      const colors = createColors({ level: 3 })
      const result = colors.green('text')
      expect(result).toContain('\u001B[32m')
    })

    it('should apply bold', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bold('text')
      expect(result).toContain('\u001B[1m')
      expect(result).toContain('\u001B[22m')
    })
  })

  describe('Chaining', () => {
    it('should chain red and bold', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red.bold('text')
      expect(result).toContain('\u001B[31m')
      expect(result).toContain('\u001B[1m')
      expect(result).toContain('text')
    })

    it('should chain multiple styles', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red.bold.underline('text')
      expect(result).toContain('\u001B[31m')
      expect(result).toContain('\u001B[1m')
      expect(result).toContain('\u001B[4m')
    })

    it('should work with any chain order', () => {
      const colors = createColors({ level: 3 })
      const result1 = colors.bold.red('text')
      const result2 = colors.red.bold('text')
      expect(result1).toContain('\u001B[1m')
      expect(result1).toContain('\u001B[31m')
      expect(result2).toContain('\u001B[31m')
      expect(result2).toContain('\u001B[1m')
    })

    it('should preserve an outer color around nested colored text', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red(`A${colors.blue('B')}C`)

      expect(result).toBe(
        '\u001B[31mA\u001B[34mB\u001B[39m\u001B[31mC\u001B[39m'
      )
    })

    it('should preserve an outer background around nested background text', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bgRed(`A${colors.bgBlue('B')}C`)

      expect(result).toBe(
        '\u001B[41mA\u001B[44mB\u001B[49m\u001B[41mC\u001B[49m'
      )
    })

    it('should cache static and dynamic style branches', () => {
      const colors = createColors({ level: 3 })

      expect(colors.red).toBe(colors.red)
      expect(colors.red.bold).toBe(colors.red.bold)
      expect(colors.gray).toBe(colors.blackBright)
      expect(colors.rgb(255, 0, 0)).toBe(colors.rgb(255, 0, 0))
      expect(colors.hex('#ff0000')).toBe(colors.rgb(255, 0, 0))
    })
  })

  describe('Dynamic colors', () => {
    it('should handle rgb() method', () => {
      const colors = createColors({ level: 3 })
      const result = colors.rgb(255, 0, 0)('text')
      expect(result).toContain('\u001B[38;2;255;0;0m')
      expect(result).toContain('text')
    })

    it('should handle hex() method', () => {
      const colors = createColors({ level: 3 })
      const result = colors.hex('#ff0000')('text')
      expect(result).toContain('\u001B[38;2;255;0;0m')
    })

    it('should handle ansi256() method', () => {
      const colors = createColors({ level: 3 })
      const result = colors.ansi256(196)('text')
      expect(result).toContain('\u001B[38;5;196m')
    })

    it('should chain dynamic colors with styles', () => {
      const colors = createColors({ level: 3 })
      const result = colors.rgb(255, 0, 0).bold('text')
      expect(result).toContain('\u001B[38;2;255;0;0m')
      expect(result).toContain('\u001B[1m')
    })
  })

  describe('Background colors', () => {
    it('should handle bgRed', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bgRed('text')
      expect(result).toContain('\u001B[41m')
    })

    it('should handle bgRgb()', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bgRgb(255, 0, 0)('text')
      expect(result).toContain('\u001B[48;2;255;0;0m')
    })

    it('should handle bgHex()', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bgHex('#ff0000')('text')
      expect(result).toContain('\u001B[48;2;255;0;0m')
    })

    it('should chain foreground and background', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red.bgGreen('text')
      expect(result).toContain('\u001B[31m')
      expect(result).toContain('\u001B[42m')
    })
  })

  describe('Color levels', () => {
    it('should disable colors at level 0', () => {
      const colors = createColors({ level: 0 })
      const result = colors.red('text')
      expect(result).toBe('text')
    })

    it('should use basic colors at level 1', () => {
      const colors = createColors({ level: 1 })
      const result = colors.red('text')
      expect(result).toContain('\u001B[31m')
    })

    it('should downgrade secondary RGB colors correctly at level 1', () => {
      const colors = createColors({ level: 1 })

      expect(colors.rgb(255, 255, 0)('yellow')).toContain('\u001B[93m')
      expect(colors.rgb(0, 255, 255)('cyan')).toContain('\u001B[96m')
    })

    it('should downgrade rgb to ansi256 at level 2', () => {
      const colors = createColors({ level: 2 })
      const result = colors.rgb(255, 0, 0)('text')
      expect(result).toContain('\u001B[38;5;')
    })

    it('should use full rgb at level 3', () => {
      const colors = createColors({ level: 3 })
      const result = colors.rgb(255, 0, 0)('text')
      expect(result).toContain('\u001B[38;2;255;0;0m')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red('')
      expect(result).toBe('')
    })

    it('should handle numbers', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red(123)
      expect(result).toContain('123')
    })

    it('should join multiple arguments with spaces', () => {
      const colors = createColors({ level: 3 })

      expect(colors.red('message', 42, true)).toBe(
        '\u001B[31mmessage 42 true\u001B[39m'
      )
      expect(colors.red()).toBe('')
    })

    it('should handle newlines', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red('line1\nline2')
      expect(result).toBe(
        '\u001B[31mline1\u001B[39m\n\u001B[31mline2\u001B[39m'
      )
    })

    it('should preserve CRLF line endings while closing and reopening styles', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red('line1\r\nline2')

      expect(result).toBe(
        '\u001B[31mline1\u001B[39m\r\n\u001B[31mline2\u001B[39m'
      )
    })

    it('should handle invalid hex gracefully', () => {
      const colors = createColors({ level: 3 })
      const result = colors.hex('invalid')('text')
      expect(result).toBe('text')
    })

    it('should handle invalid ansi256 code', () => {
      const colors = createColors({ level: 3 })
      const result = colors.ansi256(999)('text')
      expect(result).toBe('text')
    })

    it('should clamp rgb values', () => {
      const colors = createColors({ level: 3 })
      const result = colors.rgb(300, -10, 128)('text')
      expect(result).toContain('\u001B[38;2;255;0;128m')
    })

    it('should never emit non-finite RGB components', () => {
      const colors = createColors({ level: 3 })
      const result = colors.rgb(NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)('text')

      expect(result).toContain('\u001B[38;2;0;255;0m')
      expect(result).not.toContain('NaN')
      expect(result).not.toContain('Infinity')
    })
  })

  describe('Aliases', () => {
    it('should support gray as alias for grey', () => {
      const colors = createColors({ level: 3 })
      const result = colors.gray('text')
      expect(result).toContain('\u001B[90m')
    })

    it('should support bgGray as alias for bgGrey', () => {
      const colors = createColors({ level: 3 })
      const result = colors.bgGray('text')
      expect(result).toContain('\u001B[100m')
    })
  })

  describe('disabled option', () => {
    it('should disable colors with enabled: false', () => {
      const colors = createColors({ enabled: false })
      const result = colors.red.bold('text')
      expect(result).toBe('text')
    })
  })

  describe('mutable level', () => {
    it('should update every cached branch when the level changes', () => {
      const colors = createColors({ level: 3 })
      const red = colors.red

      colors.level = 0
      expect(colors.red('root')).toBe('root')
      expect(red('cached')).toBe('cached')
      expect(red.level).toBe(0)

      red.level = 3
      expect(colors.red('enabled')).toContain('\u001B[31m')
      expect(colors.level).toBe(3)
    })

    it('should allow an initially disabled instance to be enabled', () => {
      const colors = createColors({ enabled: false })
      const red = colors.red

      colors.level = 1
      expect(red('enabled')).toBe('\u001B[31menabled\u001B[39m')
    })

    it('should reject invalid color levels at runtime', () => {
      expect(() => createColors({ level: 4 as never })).toThrow(RangeError)

      const colors = createColors({ level: 1 })
      expect(() => {
        colors.level = -1 as never
      }).toThrow(RangeError)
    })
  })
})
