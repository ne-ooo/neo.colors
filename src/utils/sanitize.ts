/**
 * Remove terminal control sequences and unsafe control characters from text.
 * Newlines, carriage returns, and tabs are preserved for normal log output.
 */
export function sanitizeText(value: unknown): string {
  const input = String(value)
  let output = ''
  let index = 0

  const consumeCsi = (start: number): number => {
    let cursor = start
    while (cursor < input.length) {
      const code = input.charCodeAt(cursor)
      cursor += 1
      if (code >= 0x40 && code <= 0x7E) return cursor
    }
    return input.length
  }

  const consumeControlString = (start: number, allowBell: boolean): number => {
    let cursor = start
    while (cursor < input.length) {
      const code = input.charCodeAt(cursor)
      if (allowBell && code === 0x07) return cursor + 1
      if (code === 0x9C) return cursor + 1
      if (code === 0x1B && input.charCodeAt(cursor + 1) === 0x5C) return cursor + 2
      cursor += 1
    }
    return input.length
  }

  while (index < input.length) {
    const code = input.charCodeAt(index)

    if (code === 0x1B) {
      const next = input.charCodeAt(index + 1)
      if (next === 0x5B) {
        index = consumeCsi(index + 2)
      } else if (next === 0x5D) {
        index = consumeControlString(index + 2, true)
      } else if (next === 0x50 || next === 0x58 || next === 0x5E || next === 0x5F) {
        index = consumeControlString(index + 2, false)
      } else {
        // Consume a standard two-byte ESC sequence, including intermediates.
        index += 1
        while (index < input.length) {
          const escapeCode = input.charCodeAt(index)
          index += 1
          if (escapeCode < 0x20 || escapeCode > 0x2F) break
        }
      }
      continue
    }

    if (code === 0x9B) {
      index = consumeCsi(index + 1)
      continue
    }
    if (code === 0x9D) {
      index = consumeControlString(index + 1, true)
      continue
    }
    if (code === 0x90 || code === 0x98 || code === 0x9E || code === 0x9F) {
      index = consumeControlString(index + 1, false)
      continue
    }

    // Preserve common whitespace, but strip the remaining C0/C1 controls.
    if (code === 0x09 || code === 0x0A || code === 0x0D || (code >= 0x20 && code < 0x7F) || code > 0x9F) {
      output += input[index]
    }
    index += 1
  }

  return output
}
