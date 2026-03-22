// Production-ready logging utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Format log entry
function formatLogEntry(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (data) {
    entry.data = data;
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: isProduction ? undefined : error.stack,
    };
  }

  return entry;
}

// Output log based on environment
function output(entry: LogEntry): void {
  if (isProduction) {
    // In production, output JSON for log aggregation
    console.log(JSON.stringify(entry));
  } else {
    // In development, output readable format
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.data || '', entry.error || '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      default:
        console.log(prefix, entry.message, entry.data || '');
    }
  }
}

// Logger class
class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (!isProduction) {
      output(formatLogEntry('debug', `[${this.context}] ${message}`, data));
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    output(formatLogEntry('info', `[${this.context}] ${message}`, data));
  }

  warn(message: string, data?: Record<string, unknown>): void {
    output(formatLogEntry('warn', `[${this.context}] ${message}`, data));
  }

  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    output(formatLogEntry('error', `[${this.context}] ${message}`, data, error));
  }
}

// Create logger instance
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Default logger
export const logger = createLogger('App');

// Request logger for API routes
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
): void {
  const logLevel = statusCode >= 400 ? 'warn' : 'info';
  
  output(formatLogEntry(logLevel, 'API Request', {
    method,
    path,
    statusCode,
    duration: `${duration}ms`,
    userId: userId || 'anonymous',
  }));
}

// Error logger
export function logError(error: Error, context?: string): void {
  output(formatLogEntry('error', context || 'Unhandled error', undefined, error));
}

// Audit logger for sensitive operations
export function logAudit(
  action: string,
  userId: string,
  details: Record<string, unknown>
): void {
  output(formatLogEntry('info', `AUDIT: ${action}`, {
    userId,
    ...details,
  }));
}
