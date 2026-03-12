/**
 * Color space conversions
 * Simplified alternative to color-convert (only essential conversions)
 */

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
  // Determine which color component is dominant
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max

  // Low saturation = grayscale
  if (saturation < 0.2) {
    if (max < 64) return 30 // black
    if (max >= 192) return 97 // bright white
    return 37 // white
  }

  // Determine the dominant color
  let ansi = 30
  if (r === max) {
    ansi = b > g ? 35 : 31 // magenta or red
  } else if (g === max) {
    ansi = r > b ? 33 : 32 // yellow or green
  } else {
    ansi = g > r ? 36 : 34 // cyan or blue
  }

  // Adjust for bright colors based on maximum channel value
  if (max >= 128) {
    ansi += 60 // Convert to bright variant (90-97)
  }

  return ansi
}

/**
 * Clamp RGB values to valid range
 */
export function clampRgb(r: number, g: number, b: number): [number, number, number] {
  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b))),
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
