type EsmNamespace = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })
type Colors = EsmNamespace['default']

declare const commonJsColors: Colors & {
  readonly default: Colors
  readonly createColors: EsmNamespace['createColors']
  readonly detectColorSupport: EsmNamespace['detectColorSupport']
  readonly getStdoutColorSupport: EsmNamespace['getStdoutColorSupport']
  readonly getStderrColorSupport: EsmNamespace['getStderrColorSupport']
  readonly sanitizeText: EsmNamespace['sanitizeText']
}

export = commonJsColors
