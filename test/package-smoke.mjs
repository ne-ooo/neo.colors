import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const commonJsColors = require('../dist/index.cjs')
const esmNamespace = await import('../dist/index.js')

assert.equal(typeof commonJsColors, 'function')
assert.equal(commonJsColors.default, commonJsColors)
assert.equal(typeof commonJsColors.red.bold, 'function')
assert.equal(typeof commonJsColors.createColors, 'function')
assert.equal(typeof commonJsColors.detectColorSupport, 'function')
assert.equal(typeof commonJsColors.sanitizeText, 'function')
assert.equal(commonJsColors.sanitizeText('\u001B[31munsafe'), 'unsafe')

const commonJsForced = commonJsColors.createColors({ level: 3 })
assert.equal(
  commonJsForced.red.bold('text'),
  '\u001B[31m\u001B[1mtext\u001B[22m\u001B[39m'
)

assert.equal(typeof esmNamespace.default, 'function')
assert.equal(typeof esmNamespace.default.red.bold, 'function')
assert.equal(typeof esmNamespace.createColors, 'function')
assert.equal(esmNamespace.sanitizeText('\u001B[31munsafe'), 'unsafe')
