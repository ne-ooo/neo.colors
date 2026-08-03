/**
 * Match chalk's callable API: one value is stringified directly, while
 * multiple values are joined with spaces.
 */
export function formatArguments(values: readonly unknown[]): string {
  if (values.length === 0) return ''
  if (values.length === 1) return String(values[0])
  return values.join(' ')
}
