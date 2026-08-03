import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ansi256, blue, hex, red, rgb } from '../../src/core/direct.js'
import { clearCache } from '../../src/core/detect.js'

describe('lightweight named styles', () => {
  const originalForceColor = process.env['FORCE_COLOR']

  beforeEach(() => {
    process.env['FORCE_COLOR'] = '3'
    clearCache()
  })

  afterEach(() => {
    if (originalForceColor === undefined) {
      delete process.env['FORCE_COLOR']
    } else {
      process.env['FORCE_COLOR'] = originalForceColor
    }
    clearCache()
  })

  it('should preserve nested colors and multiline output', () => {
    expect(red(`A${blue('B')}C`)).toBe(
      '\u001B[31mA\u001B[34mB\u001B[39m\u001B[31mC\u001B[39m'
    )
    expect(red('line1\r\nline2')).toBe(
      '\u001B[31mline1\u001B[39m\r\n\u001B[31mline2\u001B[39m'
    )
  })

  it('should support multiple arguments', () => {
    expect(red('message', 42, true)).toBe('\u001B[31mmessage 42 true\u001B[39m')
  })

  it('should downgrade dynamic colors using the detected level', () => {
    process.env['FORCE_COLOR'] = '1'
    clearCache()

    expect(rgb(255, 255, 0)('yellow')).toContain('\u001B[93m')
  })

  it('should return plain styles for invalid or unsupported dynamic colors', () => {
    expect(hex('invalid')('text')).toBe('text')

    process.env['FORCE_COLOR'] = '1'
    clearCache()
    expect(ansi256(196)('text')).toBe('text')
  })
})
