import colors = require('@lpm.dev/neo.colors')

const styled: string = colors.red.bold('text')
const forced = colors.createColors({ level: 3 })
const support = colors.detectColorSupport()
const defaultColors = colors.default
const sanitized: string = colors.sanitizeText('\u001B[31munsafe')

void styled
void forced
void support
void defaultColors
void sanitized
