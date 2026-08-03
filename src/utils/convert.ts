/**
 * Color space conversions
 * Simplified alternative to color-convert (only essential conversions)
 */

const ANSI16_PALETTE = [
  [30, 0, 0, 0],
  [31, 128, 0, 0],
  [32, 0, 128, 0],
  [33, 128, 128, 0],
  [34, 0, 0, 128],
  [35, 128, 0, 128],
  [36, 0, 128, 128],
  [37, 192, 192, 192],
  [90, 128, 128, 128],
  [91, 255, 0, 0],
  [92, 0, 255, 0],
  [93, 255, 255, 0],
  [94, 0, 0, 255],
  [95, 255, 0, 255],
  [96, 0, 255, 255],
  [97, 255, 255, 255],
] as const

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const clean = hex.replace(/^#/, '')

  // Handle shorthand hex (#RGB -> #RRGGBB)
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean

  // Validate
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  // Parse
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  return [r, g, b]
}

/**
 * Convert RGB to 256-color ANSI code
 * Uses the xterm 256-color palette
 */
export function rgbToAnsi256(r: number, g: number, b: number): number {
  // Grayscale check
  if (r === g && g === b) {
    if (r < 8) return 16
    if (r > 248) return 231
    return Math.round(((r - 8) / 247) * 24) + 232
  }

  // Convert to 216-color cube (6x6x6)
  const rIndex = Math.round((r / 255) * 5)
  const gIndex = Math.round((g / 255) * 5)
  const bIndex = Math.round((b / 255) * 5)

  return 16 + (36 * rIndex) + (6 * gIndex) + bIndex
}

/**
 * Convert RGB to 16-color ANSI code
 */
export function rgbToAnsi16(r: number, g: number, b: number): number {
  let closestCode: number = ANSI16_PALETTE[0][0]
  let closestDistance = Number.POSITIVE_INFINITY

  for (const [code, pr, pg, pb] of ANSI16_PALETTE) {
    const distance = ((r - pr) ** 2) + ((g - pg) ** 2) + ((b - pb) ** 2)
    if (distance < closestDistance) {
      closestCode = code
      closestDistance = distance
    }
  }

  return closestCode
}

/**
 * Clamp RGB values to valid range
 */
export function clampRgb(r: number, g: number, b: number): [number, number, number] {
  const clampChannel = (value: number): number => {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue) || numericValue === Number.NEGATIVE_INFINITY) return 0
    if (numericValue === Number.POSITIVE_INFINITY) return 255
    return Math.max(0, Math.min(255, Math.round(numericValue)))
  }

  return [
    clampChannel(r),
    clampChannel(g),
    clampChannel(b),
  ]
}

/**
 * Validate RGB values
 */
export function isValidRgb(r: number, g: number, b: number): boolean {
  return (
    Number.isInteger(r) && r >= 0 && r <= 255 &&
    Number.isInteger(g) && g >= 0 && g <= 255 &&
    Number.isInteger(b) && b >= 0 && b <= 255
  )
}

/**
 * Validate 256-color code
 */
export function isValidAnsi256(code: number): boolean {
  return Number.isInteger(code) && code >= 0 && code <= 255
}
