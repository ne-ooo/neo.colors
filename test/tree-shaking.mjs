import assert from 'node:assert/strict'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

async function bundle(contents) {
  const result = await build({
    stdin: {
      contents,
      resolveDir: process.cwd(),
      sourcefile: 'tree-shaking-entry.mjs',
    },
    bundle: true,
    format: 'esm',
    minify: true,
    platform: 'node',
    target: 'node18',
    treeShaking: true,
    write: false,
  })

  const output = result.outputFiles[0].contents
  return {
    raw: output.byteLength,
    gzip: gzipSync(output).byteLength,
    text: result.outputFiles[0].text,
  }
}

const named = await bundle("import { red } from './dist/index.js'; console.log(red('x'))")
const chainable = await bundle("import colors from './dist/index.js'; console.log(colors.red('x'))")

assert.ok(
  named.raw < chainable.raw * 0.7,
  `named red bundle (${named.raw} B) should be at least 30% smaller than default (${chainable.raw} B)`
)
assert.ok(!named.text.includes('bgWhiteBright'), 'named red bundle retained unrelated style names')

console.log(
  `tree-shaking: named red ${named.raw} B/${named.gzip} B gzip; ` +
  `default ${chainable.raw} B/${chainable.gzip} B gzip`
)
