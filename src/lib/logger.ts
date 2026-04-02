

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


const isProduction = process.env.NODE_ENV === 'production';


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


function output(entry: LogEntry): void {
  if (isProduction) {
    
    console.log(JSON.stringify(entry));
  } else {
    
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


export function createLogger(context: string): Logger {
  return new Logger(context);
}


export const logger = createLogger('App');


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


export function logError(error: Error, context?: string): void {
  output(formatLogEntry('error', context || 'Unhandled error', undefined, error));
}


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
