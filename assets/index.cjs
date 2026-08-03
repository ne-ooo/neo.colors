'use strict'

// Native CommonJS should receive the chainable callable directly, not the
// namespace object emitted for a module with both default and named exports.
const namespace = require('./index.internal.cjs')
const colors = namespace.default

Object.defineProperties(colors, {
  default: { value: colors, enumerable: false },
  createColors: { value: namespace.createColors, enumerable: true },
  detectColorSupport: { value: namespace.detectColorSupport, enumerable: true },
  getStdoutColorSupport: { value: namespace.getStdoutColorSupport, enumerable: true },
  getStderrColorSupport: { value: namespace.getStderrColorSupport, enumerable: true },
  sanitizeText: { value: namespace.sanitizeText, enumerable: true },
})

module.exports = colors
