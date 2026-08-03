import { copyFile, mkdir } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await Promise.all([
  copyFile('assets/index.cjs', 'dist/index.cjs'),
  copyFile('assets/index.require.d.cts', 'dist/index.require.d.cts'),
])
