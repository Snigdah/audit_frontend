import log from 'loglevel';

// Set default log level
const defaultLevel = import.meta.env.MODE === 'development' ? 'debug' : 'warn';
log.setLevel(defaultLevel);

// Optional: map log levels for more control
export const LogLevel = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export const createLogger = (moduleName: string) => ({
  trace: (...args: unknown[]) => log.trace(`[${moduleName}]`, ...args),
  debug: (...args: unknown[]) => log.debug(`[${moduleName}]`, ...args),
  info: (...args: unknown[]) => log.info(`[${moduleName}]`, ...args),
  warn: (...args: unknown[]) => log.warn(`[${moduleName}]`, ...args),
  error: (...args: unknown[]) => log.error(`[${moduleName}]`, ...args),
});

export default log;