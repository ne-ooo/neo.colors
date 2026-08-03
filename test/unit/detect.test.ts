/**
 * Terminal detection tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { detectColorSupport, clearCache } from '../../src/core/detect.js'

describe('Terminal Detection', () => {
  const originalEnv = { ...process.env }
  const originalArgv = [...process.argv]
  const tty = { isTTY: true } as NodeJS.WriteStream
  const pipe = { isTTY: false } as NodeJS.WriteStream
  const detectionVariables = [
    'FORCE_COLOR',
    'NO_COLOR',
    'TERM',
    'COLORTERM',
    'TERM_PROGRAM',
    'TERM_PROGRAM_VERSION',
    'CI',
    'CONTINUOUS_INTEGRATION',
    'BUILD_NUMBER',
    'RUN_ID',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'BUILDKITE',
    'CIRCLECI',
    'TRAVIS',
    'APPVEYOR',
    'TF_BUILD',
  ]

  beforeEach(() => {
    clearCache()
    process.argv = ['node', 'script.js']
    for (const name of detectionVariables) {
      delete process.env[name]
    }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    process.argv = [...originalArgv]
    clearCache()
  })

  describe('CLI flags', () => {
    it('should force basic color with --color even for a pipe', () => {
      process.argv.push('--color')
      expect(detectColorSupport(pipe).level).toBe(1)
    })

    it('should give --no-color priority over FORCE_COLOR', () => {
      process.argv.push('--no-color')
      process.env['FORCE_COLOR'] = '3'
      expect(detectColorSupport(tty).level).toBe(0)
    })

    it('should detect extended color flags', () => {
      process.argv.push('--color=256')
      expect(detectColorSupport(pipe).level).toBe(2)

      process.argv = ['node', 'script.js', '--color=16m']
      expect(detectColorSupport(pipe).level).toBe(3)
    })

    it('should ignore similarly named options and process the last valid flag', () => {
      process.argv.push('--colorful', '--color=256', '--no-color', '--color')
      expect(detectColorSupport(pipe).level).toBe(1)
    })
  })

  describe('environment overrides', () => {
    it.each([
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['true', 1],
      ['', 1],
      ['false', 0],
      ['0', 0],
    ])('should map FORCE_COLOR=%s to level %i', (value, expected) => {
      process.env['FORCE_COLOR'] = value
      expect(detectColorSupport(pipe).level).toBe(expected)
    })

    it('should let FORCE_COLOR override NO_COLOR', () => {
      process.env['FORCE_COLOR'] = '2'
      process.env['NO_COLOR'] = '1'
      expect(detectColorSupport(pipe).level).toBe(2)
    })

    it('should disable colors when NO_COLOR is present', () => {
      process.env['NO_COLOR'] = ''
      expect(detectColorSupport(tty).level).toBe(0)
    })

    it('should disable colors for TERM=dumb', () => {
      process.env['TERM'] = 'dumb'
      expect(detectColorSupport(tty).level).toBe(0)
    })
  })

  describe('stream and terminal capabilities', () => {
    it('should keep a piped stream plain even when TERM advertises 256 colors', () => {
      process.env['TERM'] = 'xterm-256color'
      expect(detectColorSupport(pipe).level).toBe(0)
    })

    it('should keep a piped stream plain even when COLORTERM advertises truecolor', () => {
      process.env['COLORTERM'] = 'truecolor'
      expect(detectColorSupport(pipe).level).toBe(0)
    })

    it('should detect basic support for a TTY without capability variables', () => {
      expect(detectColorSupport(tty).level).toBe(1)
    })

    it('should detect 256 color support from TERM on a TTY', () => {
      process.env['TERM'] = 'xterm-256color'
      expect(detectColorSupport(tty).level).toBe(2)
    })

    it.each(['truecolor', '24bit'])('should detect truecolor from COLORTERM=%s', value => {
      process.env['COLORTERM'] = value
      expect(detectColorSupport(tty).level).toBe(3)
    })

    it('should consider TERM_PROGRAM even when TERM is also present', () => {
      process.env['TERM'] = 'xterm-256color'
      process.env['TERM_PROGRAM'] = 'iTerm.app'
      process.env['TERM_PROGRAM_VERSION'] = '3.5.0'
      expect(detectColorSupport(tty).level).toBe(3)
    })

    it('should detect generic CI as basic color on a TTY', () => {
      process.env['CI'] = 'true'
      expect(detectColorSupport(tty).level).toBe(1)
    })

    it('should not treat CI=false as a CI environment', () => {
      process.env['CI'] = 'false'
      expect(detectColorSupport(tty).level).toBe(1)
    })
  })

  describe('ColorSupport properties', () => {
    it.each([
      [0, false, false, false],
      [1, true, false, false],
      [2, true, true, false],
      [3, true, true, true],
    ] as const)(
      'should derive capability booleans for level %i',
      (level, hasBasic, has256, has16m) => {
        process.env['FORCE_COLOR'] = String(level)
        expect(detectColorSupport(pipe)).toEqual({ level, hasBasic, has256, has16m })
      }
    )
  })
})
