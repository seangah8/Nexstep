import fs from 'fs'

// Main logger export
export const loggerService = {
  debug: (...args: unknown[]) => {
    doLog('DEBUG', ...args)
  },
  info: (...args: unknown[]) => {
    doLog('INFO', ...args)
  },
  warn: (...args: unknown[]) => {
    doLog('WARN', ...args)
  },
  error: (...args: unknown[]) => {
    doLog('ERROR', ...args)
  },
}

const logsDir = './logs'

// Create logs folder if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Get formatted time string
function getTime(): string {
  const now = new Date()
  return now.toLocaleString('he')
}

// Check if an object is an Error
function isError(e: unknown): e is Error {
  return (
    typeof e === 'object' &&
    e !== null &&
    'stack' in e &&
    'message' in e
  )
}

// The core logging function
function doLog(level: string, ...args: unknown[]) {
  const strs = args.map((arg) =>
    typeof arg === 'string'
      ? arg
      : isError(arg)
      ? (arg as Error).message + '\n' + (arg as Error).stack
      : JSON.stringify(arg)
  )

  let line = strs.join(' | ')
  line = `${getTime()} - ${level} - ${line}\n`

  console.log(line)

  fs.appendFile('./logs/backend.log', line, (err) => {
    if (err) console.error('FATAL: cannot write to log file')
  })
}
