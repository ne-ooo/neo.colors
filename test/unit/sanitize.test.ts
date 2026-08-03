import { describe, expect, it } from 'vitest'
import { sanitizeText } from '../../src/utils/sanitize.js'

describe('sanitizeText()', () => {
  it('should remove CSI styling sequences', () => {
    expect(sanitizeText('\u001B[31mred\u001B[0m')).toBe('red')
    expect(sanitizeText('\u009B31mred\u009B0m')).toBe('red')
  })

  it('should remove OSC title, clipboard, and hyperlink controls', () => {
    expect(sanitizeText('before\u001B]0;title\u0007after')).toBe('beforeafter')
    expect(sanitizeText('before\u001B]52;c;payload\u001B\\after')).toBe('beforeafter')
    expect(sanitizeText('\u001B]8;;https://example.com\u001B\\label\u001B]8;;\u001B\\')).toBe('label')
  })

  it('should remove DCS and incomplete control strings', () => {
    expect(sanitizeText('before\u001BPpayload\u001B\\after')).toBe('beforeafter')
    expect(sanitizeText('safe\u001B]52;c;unfinished')).toBe('safe')
    expect(sanitizeText('safe\u001B[31')).toBe('safe')
    expect(sanitizeText('before\u001BXpayload\u001B\\after')).toBe('beforeafter')
    expect(sanitizeText('before\u0090payload\u009Cafter')).toBe('beforeafter')
  })

  it('should remove C1 OSC strings and standard ESC sequences', () => {
    expect(sanitizeText('before\u009D0;title\u0007after')).toBe('beforeafter')
    expect(sanitizeText('before\u001B(0after')).toBe('beforeafter')
  })

  it('should preserve printable text and normal log whitespace', () => {
    expect(sanitizeText('line 1\n\tline 2\r\n')).toBe('line 1\n\tline 2\r\n')
    expect(sanitizeText('a\u0000b\u0008c\u007Fd')).toBe('abcd')
    expect(sanitizeText(42)).toBe('42')
  })
})
