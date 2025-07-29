// Safe logging utility that respects performance

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const isDevelopment = import.meta.env.DEV;

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (!isDevelopment) {
      // In production, only log errors and warnings
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  error(...args: any[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog('info')) {
      console.log('[INFO]', ...args);
    }
  }

  debug(...args: any[]) {
    if (this.shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  }

  // Performance timing
  time(label: string) {
    if (this.shouldLog('debug')) {
      console.time(`[TIMER] ${label}`);
    }
  }

  timeEnd(label: string) {
    if (this.shouldLog('debug')) {
      console.timeEnd(`[TIMER] ${label}`);
    }
  }
}

export const logger = new Logger();