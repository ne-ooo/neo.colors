/**
 * ANSI codes tests
 */

import { describe, it, expect } from 'vitest'
import { styles, ansi256, rgb, aliases, isStyleName, getStyle } from '../../src/core/ansi-codes.js'

describe('ANSI Codes', () => {
  describe('Basic styles', () => {
    it('should export reset code', () => {
      expect(styles.reset).toEqual({ open: '\u001B[0m', close: '\u001B[0m' })
    })

    it('should export bold code', () => {
      expect(styles.bold).toEqual({ open: '\u001B[1m', close: '\u001B[22m' })
    })

    it('should export dim code', () => {
      expect(styles.dim).toEqual({ open: '\u001B[2m', close: '\u001B[22m' })
    })

    it('should export italic code', () => {
      expect(styles.italic).toEqual({ open: '\u001B[3m', close: '\u001B[23m' })
    })

    it('should export underline code', () => {
      expect(styles.underline).toEqual({ open: '\u001B[4m', close: '\u001B[24m' })
    })
  })

  describe('Foreground colors', () => {
    it('should export red color', () => {
      expect(styles.red).toEqual({ open: '\u001B[31m', close: '\u001B[39m' })
    })

    it('should export green color', () => {
      expect(styles.green).toEqual({ open: '\u001B[32m', close: '\u001B[39m' })
    })

    it('should export blue color', () => {
      expect(styles.blue).toEqual({ open: '\u001B[34m', close: '\u001B[39m' })
    })
  })

  describe('Background colors', () => {
    it('should export bgRed color', () => {
      expect(styles.bgRed).toEqual({ open: '\u001B[41m', close: '\u001B[49m' })
    })

    it('should export bgGreen color', () => {
      expect(styles.bgGreen).toEqual({ open: '\u001B[42m', close: '\u001B[49m' })
    })
  })

  describe('Bright colors', () => {
    it('should export redBright color', () => {
      expect(styles.redBright).toEqual({ open: '\u001B[91m', close: '\u001B[39m' })
    })

    it('should export bgRedBright color', () => {
      expect(styles.bgRedBright).toEqual({ open: '\u001B[101m', close: '\u001B[49m' })
    })
  })

  describe('Aliases', () => {
    it('should have gray and grey as aliases for blackBright', () => {
      expect(aliases.gray).toEqual(styles.blackBright)
      expect(aliases.grey).toEqual(styles.blackBright)
    })

    it('should have bgGray and bgGrey as aliases for bgBlackBright', () => {
      expect(aliases.bgGray).toEqual(styles.bgBlackBright)
      expect(aliases.bgGrey).toEqual(styles.bgBlackBright)
    })

    it('should only accept own style and alias properties', () => {
      expect(isStyleName('red')).toBe(true)
      expect(isStyleName('gray')).toBe(true)
      expect(isStyleName('toString')).toBe(false)
      expect(isStyleName('__proto__')).toBe(false)
      expect(getStyle('toString')).toBeUndefined()
      expect(getStyle('__proto__')).toBeUndefined()
    })
  })

  describe('ansi256()', () => {
    it('should generate foreground ANSI256 codes', () => {
      expect(ansi256(196)).toEqual({
        open: '\u001B[38;5;196m',
        close: '\u001B[39m',
      })
    })

    it('should generate background ANSI256 codes', () => {
      expect(ansi256(196, true)).toEqual({
        open: '\u001B[48;5;196m',
        close: '\u001B[49m',
      })
    })
  })

  describe('rgb()', () => {
    it('should generate foreground RGB codes', () => {
      expect(rgb(255, 0, 0)).toEqual({
        open: '\u001B[38;2;255;0;0m',
        close: '\u001B[39m',
      })
    })

    it('should generate background RGB codes', () => {
      expect(rgb(0, 255, 0, true)).toEqual({
        open: '\u001B[48;2;0;255;0m',
        close: '\u001B[49m',
      })
    })
  })
})
