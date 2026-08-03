/**
 * Performance comparison: @lpm.dev/neo.colors vs chalk
 */

import { describe, bench } from 'vitest'
import chalk from 'chalk'
import { createColors } from '../../src/index.js'

// Compare equivalent, deterministic truecolor instances. Auto-detected
// defaults would benchmark disabled output when the runner is not a TTY.
const colors = createColors({ level: 3 })
const enabledChalk = new chalk.Instance({ level: 3 })

describe('Basic Colors', () => {
  const text = 'Hello World'

  bench('@lpm.dev/neo.colors - red', () => {
    colors.red(text)
  })

  bench('chalk - red', () => {
    enabledChalk.red(text)
  })

  bench('@lpm.dev/neo.colors - green', () => {
    colors.green(text)
  })

  bench('chalk - green', () => {
    enabledChalk.green(text)
  })

  bench('@lpm.dev/neo.colors - blue', () => {
    colors.blue(text)
  })

  bench('chalk - blue', () => {
    enabledChalk.blue(text)
  })
})

describe('Chained Styles', () => {
  const text = 'Hello World'

  bench('@lpm.dev/neo.colors - red.bold', () => {
    colors.red.bold(text)
  })

  bench('chalk - red.bold', () => {
    enabledChalk.red.bold(text)
  })

  bench('@lpm.dev/neo.colors - red.bold.underline', () => {
    colors.red.bold.underline(text)
  })

  bench('chalk - red.bold.underline', () => {
    enabledChalk.red.bold.underline(text)
  })

  bench('@lpm.dev/neo.colors - bgRed.white.bold', () => {
    colors.bgRed.white.bold(text)
  })

  bench('chalk - bgRed.white.bold', () => {
    enabledChalk.bgRed.white.bold(text)
  })
})

describe('RGB Colors', () => {
  const text = 'Hello World'

  bench('@lpm.dev/neo.colors - rgb(255, 0, 0)', () => {
    colors.rgb(255, 0, 0)(text)
  })

  bench('chalk - rgb(255, 0, 0)', () => {
    enabledChalk.rgb(255, 0, 0)(text)
  })

  bench('@lpm.dev/neo.colors - hex(#ff0000)', () => {
    colors.hex('#ff0000')(text)
  })

  bench('chalk - hex(#ff0000)', () => {
    enabledChalk.hex('#ff0000')(text)
  })
})

describe('Real-world Scenarios', () => {
  bench('@lpm.dev/neo.colors - error message', () => {
    const msg = colors.red.bold('Error:') + ' ' + colors.red('Something went wrong')
    return msg
  })

  bench('chalk - error message', () => {
    const msg = enabledChalk.red.bold('Error:') + ' ' + enabledChalk.red('Something went wrong')
    return msg
  })

  bench('@lpm.dev/neo.colors - success message', () => {
    const msg = colors.green('✓') + ' ' + colors.green.bold('Build successful!')
    return msg
  })

  bench('chalk - success message', () => {
    const msg = enabledChalk.green('✓') + ' ' + enabledChalk.green.bold('Build successful!')
    return msg
  })

  bench('@lpm.dev/neo.colors - colorful log', () => {
    const msg = [
      colors.cyan('[INFO]'),
      colors.yellow(new Date().toISOString()),
      colors.white('Server started on'),
      colors.blue.underline('http://localhost:3000'),
    ].join(' ')
    return msg
  })

  bench('chalk - colorful log', () => {
    const msg = [
      enabledChalk.cyan('[INFO]'),
      enabledChalk.yellow(new Date().toISOString()),
      enabledChalk.white('Server started on'),
      enabledChalk.blue.underline('http://localhost:3000'),
    ].join(' ')
    return msg
  })
})

describe('Disabled Colors (level 0)', () => {
  const text = 'Hello World'

  // Create instances with colors disabled
  const disabledColors = createColors({ level: 0 })
  const disabledChalk = new chalk.Instance({ level: 0 })

  bench('@lpm.dev/neo.colors - disabled', () => {
    disabledColors.red.bold(text)
  })

  bench('chalk - disabled', () => {
    disabledChalk.red.bold(text)
  })
})
