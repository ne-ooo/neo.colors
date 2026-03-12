/**
 * Main API exports tests
 */

import { describe, it, expect } from 'vitest'
import colors, {
  createColors,
  detectColorSupport,
  red,
  green,
  blue,
  bold,
  dim,
  rgb,
  hex,
  ansi256,
} from '../../src/index.js'

describe('Main API', () => {
  describe('Default export', () => {
    it('should export default colors instance', () => {
      expect(colors).toBeDefined()
      expect(typeof colors).toBe('function')
    })

    it('should have color properties', () => {
      expect(colors.red).toBeDefined()
      expect(colors.green).toBeDefined()
      expect(colors.blue).toBeDefined()
    })

    it('should have style properties', () => {
      expect(colors.bold).toBeDefined()
      expect(colors.dim).toBeDefined()
      expect(colors.italic).toBeDefined()
    })

    it('should have level property', () => {
      expect(typeof colors.level).toBe('number')
      expect(colors.level).toBeGreaterThanOrEqual(0)
      expect(colors.level).toBeLessThanOrEqual(3)
    })
  })

  describe('Named exports', () => {
    it('should export createColors function', () => {
      expect(typeof createColors).toBe('function')
      const custom = createColors({ level: 3 })
      expect(custom).toBeDefined()
      expect(typeof custom).toBe('function')
    })

    it('should export detectColorSupport function', () => {
      expect(typeof detectColorSupport).toBe('function')
      const support = detectColorSupport()
      expect(support).toBeDefined()
      expect(support.level).toBeDefined()
    })
  })

  describe('Tree-shakeable style functions', () => {
    it('should export red function', () => {
      expect(typeof red).toBe('function')
      const result = red('test')
      expect(typeof result).toBe('string')
    })

    it('should export green function', () => {
      expect(typeof green).toBe('function')
    })

    it('should export blue function', () => {
      expect(typeof blue).toBe('function')
    })

    it('should export bold function', () => {
      expect(typeof bold).toBe('function')
    })

    it('should export dim function', () => {
      expect(typeof dim).toBe('function')
    })
  })

  describe('Tree-shakeable dynamic color functions', () => {
    it('should export rgb function', () => {
      expect(typeof rgb).toBe('function')
      const colorFn = rgb(255, 0, 0)
      expect(typeof colorFn).toBe('function')
      const result = colorFn('test')
      expect(typeof result).toBe('string')
    })

    it('should export hex function', () => {
      expect(typeof hex).toBe('function')
      const colorFn = hex('#ff0000')
      expect(typeof colorFn).toBe('function')
    })

    it('should export ansi256 function', () => {
      expect(typeof ansi256).toBe('function')
      const colorFn = ansi256(196)
      expect(typeof colorFn).toBe('function')
    })
  })

  describe('Usage patterns', () => {
    it('should work with default export chainable style', () => {
      const result = colors.red.bold('text')
      expect(typeof result).toBe('string')
    })

    it('should work with named export style', () => {
      const result = red(bold('text'))
      expect(typeof result).toBe('string')
    })

    it('should work with custom instance', () => {
      const custom = createColors({ level: 0 })
      const result = custom.red('text')
      expect(result).toBe('text')
    })
  })
})
