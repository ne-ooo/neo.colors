/**
 * Terminal detection tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { detectColorSupport, clearCache } from '../../src/core/detect.js'

describe('Terminal Detection', () => {
  const originalEnv = { ...process.env }
  const originalArgv = [...process.argv]

  beforeEach(() => {
    // Clear cache before each test
    clearCache()
    // Reset env vars
    delete process.env['FORCE_COLOR']
    delete process.env['NO_COLOR']
    delete process.env['TERM']
    delete process.env['COLORTERM']
    delete process.env['TERM_PROGRAM']
    delete process.env['CI']
  })

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv }
    process.argv = [...originalArgv]
    clearCache()
  })

  describe('CLI flags', () => {
    it('should detect --color flag', () => {
      process.argv = ['node', 'script.js', '--color']
      const support = detectColorSupport()
      expect(support.level).toBeGreaterThanOrEqual(1)
    })

    it('should detect --no-color flag', () => {
      process.argv = ['node', 'script.js', '--no-color']
      const support = detectColorSupport()
      expect(support.level).toBe(0)
    })

    it('should detect --color=256', () => {
      process.argv = ['node', 'script.js', '--color=256']
      const support = detectColorSupport()
      expect(support.level).toBe(2)
    })

    it('should detect --color=16m', () => {
      process.argv = ['node', 'script.js', '--color=16m']
      const support = detectColorSupport()
      expect(support.level).toBe(3)
    })
  })

  describe('FORCE_COLOR env var', () => {
    it('should enable colors with FORCE_COLOR=1', () => {
      process.env['FORCE_COLOR'] = '1'
      const support = detectColorSupport()
      expect(support.level).toBe(1)
    })

    it('should enable colors with FORCE_COLOR=2', () => {
      process.env['FORCE_COLOR'] = '2'
      const support = detectColorSupport()
      expect(support.level).toBe(2)
    })

    it('should enable colors with FORCE_COLOR=3', () => {
      process.env['FORCE_COLOR'] = '3'
      const support = detectColorSupport()
      expect(support.level).toBe(3)
    })

    it('should disable colors with FORCE_COLOR=false', () => {
      process.env['FORCE_COLOR'] = 'false'
      const support = detectColorSupport()
      expect(support.level).toBe(0)
    })
  })

  describe('NO_COLOR env var', () => {
    it('should disable colors with NO_COLOR set', () => {
      process.env['NO_COLOR'] = '1'
      const support = detectColorSupport()
      expect(support.level).toBe(0)
    })
  })

  describe('TERM env var', () => {
    it('should disable colors with TERM=dumb', () => {
      process.env['TERM'] = 'dumb'
      const support = detectColorSupport()
      expect(support.level).toBe(0)
    })

    it('should detect 256 color support from TERM', () => {
      process.env['TERM'] = 'xterm-256color'
      const support = detectColorSupport()
      expect(support.level).toBeGreaterThanOrEqual(2)
    })
  })

  describe('COLORTERM env var', () => {
    it('should detect truecolor with COLORTERM=truecolor', () => {
      process.env['COLORTERM'] = 'truecolor'
      const support = detectColorSupport()
      expect(support.level).toBe(3)
    })

    it('should detect truecolor with COLORTERM=24bit', () => {
      process.env['COLORTERM'] = '24bit'
      const support = detectColorSupport()
      expect(support.level).toBe(3)
    })
  })

  describe('ColorSupport properties', () => {
    it('should set hasBasic for level >= 1', () => {
      process.env['FORCE_COLOR'] = '1'
      const support = detectColorSupport()
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(false)
      expect(support.has16m).toBe(false)
    })

    it('should set has256 for level >= 2', () => {
      process.env['FORCE_COLOR'] = '2'
      const support = detectColorSupport()
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(false)
    })

    it('should set has16m for level >= 3', () => {
      process.env['FORCE_COLOR'] = '3'
      const support = detectColorSupport()
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(true)
    })

    it('should set all false for level 0', () => {
      process.env['NO_COLOR'] = '1'
      const support = detectColorSupport()
      expect(support.hasBasic).toBe(false)
      expect(support.has256).toBe(false)
      expect(support.has16m).toBe(false)
    })
  })
})
