type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

/**
 * Structured logger for better debugging and monitoring
 * Uses JSON format in production, pretty format in development
 */
class Logger {
  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      // JSON logging for production (easier to parse by log aggregators)
      console[level](JSON.stringify(logEntry));
    } else {
      // Pretty logging for development
      const metaStr = meta ? ` ${JSON.stringify(meta, null, 2)}` : '';
      console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`);
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
