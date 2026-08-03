import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const changelog = await readFile(new URL('CHANGELOG.md', root), 'utf8')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const output = execFileSync(
  npm,
  ['pack', '--dry-run', '--json', '--ignore-scripts'],
  { cwd: root, encoding: 'utf8' }
)
const [packed] = JSON.parse(output)

assert.equal(packed.name, packageJson.name)
assert.equal(packed.version, packageJson.version)
assert.ok(
  changelog.includes(`## [${packageJson.version}]`),
  `CHANGELOG.md must contain a ${packageJson.version} release section`
)

const expectedFiles = [
  '.lpm/skills/anti-patterns.md',
  '.lpm/skills/getting-started.md',
  '.lpm/skills/migrate-from-chalk.md',
  'BENCHMARKS.md',
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'SECURITY.md',
  'dist/index.cjs',
  'dist/index.d.cts',
  'dist/index.d.ts',
  'dist/index.internal.cjs',
  'dist/index.internal.cjs.map',
  'dist/index.js',
  'dist/index.js.map',
  'dist/index.require.d.cts',
  'package.json',
]
const actualFiles = packed.files.map(({ path }) => path).sort()

assert.deepEqual(actualFiles, expectedFiles.sort())
console.log(`package: ${packed.id} contains ${actualFiles.length} verified files`)
