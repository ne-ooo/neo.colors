/**
 * Color conversion tests
 */

import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToAnsi256, rgbToAnsi16, clampRgb, isValidAnsi256 } from '../../src/utils/convert.js'

describe('Color Conversions', () => {
  describe('hexToRgb()', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0])
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0])
      expect(hexToRgb('#0000ff')).toEqual([0, 0, 255])
    })

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRgb('#f00')).toEqual([255, 0, 0])
      expect(hexToRgb('#0f0')).toEqual([0, 255, 0])
      expect(hexToRgb('#00f')).toEqual([0, 0, 255])
    })

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual([255, 0, 0])
      expect(hexToRgb('f00')).toEqual([255, 0, 0])
    })

    it('should handle mixed case', () => {
      expect(hexToRgb('#FF0000')).toEqual([255, 0, 0])
      expect(hexToRgb('#Ff0000')).toEqual([255, 0, 0])
    })
  })

  describe('rgbToAnsi256()', () => {
    it('should convert pure black to ANSI 16', () => {
      expect(rgbToAnsi256(0, 0, 0)).toBe(16)
    })

    it('should convert pure white to ANSI 231', () => {
      expect(rgbToAnsi256(255, 255, 255)).toBe(231)
    })

    it('should convert grayscale to grayscale range (232-255)', () => {
      const result = rgbToAnsi256(128, 128, 128)
      expect(result).toBeGreaterThanOrEqual(232)
      expect(result).toBeLessThanOrEqual(255)
    })

    it('should convert RGB to 216-color cube', () => {
      // Pure red
      expect(rgbToAnsi256(255, 0, 0)).toBe(196)

      // Pure green
      expect(rgbToAnsi256(0, 255, 0)).toBe(46)

      // Pure blue
      expect(rgbToAnsi256(0, 0, 255)).toBe(21)
    })
  })

  describe('rgbToAnsi16()', () => {
    it('should convert black to ANSI 30', () => {
      expect(rgbToAnsi16(0, 0, 0)).toBe(30)
    })

    it('should convert white to ANSI 97', () => {
      expect(rgbToAnsi16(255, 255, 255)).toBe(97)
    })

    it('should convert pure red', () => {
      expect(rgbToAnsi16(255, 0, 0)).toBe(91)
    })

    it('should convert pure green', () => {
      expect(rgbToAnsi16(0, 255, 0)).toBe(92)
    })

    it('should convert pure blue', () => {
      expect(rgbToAnsi16(0, 0, 255)).toBe(94)
    })

    it('should convert secondary colors without losing tied channels', () => {
      expect(rgbToAnsi16(255, 255, 0)).toBe(93)
      expect(rgbToAnsi16(0, 255, 255)).toBe(96)
      expect(rgbToAnsi16(255, 0, 255)).toBe(95)
    })

    it('should select the nearest grayscale palette entry', () => {
      expect(rgbToAnsi16(128, 128, 128)).toBe(90)
      expect(rgbToAnsi16(192, 192, 192)).toBe(37)
    })
  })

  describe('clampRgb()', () => {
    it('should pass valid RGB values', () => {
      expect(clampRgb(128, 64, 32)).toEqual([128, 64, 32])
    })

    it('should clamp values above 255', () => {
      expect(clampRgb(300, 256, 1000)).toEqual([255, 255, 255])
    })

    it('should clamp negative values to 0', () => {
      expect(clampRgb(-10, -1, -100)).toEqual([0, 0, 0])
    })

    it('should handle mixed valid and invalid values', () => {
      expect(clampRgb(300, 128, -10)).toEqual([255, 128, 0])
    })

    it('should round decimal values', () => {
      expect(clampRgb(128.7, 64.3, 32.9)).toEqual([129, 64, 33])
    })

    it('should normalize non-finite values', () => {
      expect(clampRgb(NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).toEqual([0, 255, 0])
      expect(clampRgb('invalid' as never, '128' as never, null as never)).toEqual([0, 128, 0])
    })
  })

  describe('isValidAnsi256()', () => {
    it('should accept valid ANSI256 codes (0-255)', () => {
      expect(isValidAnsi256(0)).toBe(true)
      expect(isValidAnsi256(128)).toBe(true)
      expect(isValidAnsi256(255)).toBe(true)
    })

    it('should reject negative codes', () => {
      expect(isValidAnsi256(-1)).toBe(false)
      expect(isValidAnsi256(-100)).toBe(false)
    })

    it('should reject codes above 255', () => {
      expect(isValidAnsi256(256)).toBe(false)
      expect(isValidAnsi256(1000)).toBe(false)
    })

    it('should reject non-integers', () => {
      expect(isValidAnsi256(128.5)).toBe(false)
      expect(isValidAnsi256(NaN)).toBe(false)
    })
  })
})
