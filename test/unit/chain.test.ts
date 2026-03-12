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

    it('should handle newlines', () => {
      const colors = createColors({ level: 3 })
      const result = colors.red('line1\nline2')
      expect(result).toContain('line1')
      expect(result).toContain('line2')
      // Should close and reopen colors around newline
      expect(result).toContain('\n')
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
})
