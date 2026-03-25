import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createLogger } from './logger';

const logger = createLogger('API');

// Standard API error response
export interface ApiErrorResponse {
  error: string;
  details?: string;
  code?: string;
  timestamp: string;
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Common errors
export const Errors = {
  Unauthorized: (message = 'Unauthorized') => new ApiError(message, 401, 'UNAUTHORIZED'),
  Forbidden: (message = 'Forbidden') => new ApiError(message, 403, 'FORBIDDEN'),
  NotFound: (message = 'Resource not found') => new ApiError(message, 404, 'NOT_FOUND'),
  BadRequest: (message: string, details?: string) => new ApiError(message, 400, 'BAD_REQUEST', details),
  Conflict: (message: string) => new ApiError(message, 409, 'CONFLICT'),
  TooManyRequests: (retryAfter?: number) => new ApiError(
    'Too many requests. Please try again later.',
    429,
    'RATE_LIMITED',
    retryAfter ? `Retry after ${retryAfter} seconds` : undefined
  ),
  Internal: (message = 'Internal server error') => new ApiError(message, 500, 'INTERNAL_ERROR'),
} as const;

// Handle API errors consistently
export function handleApiError(error: unknown): NextResponse {
  // Log the error
  if (error instanceof ApiError) {
    logger.warn(`API Error: ${error.message}`, { 
      code: error.code, 
      statusCode: error.statusCode,
      details: error.details 
    });
  } else if (error instanceof Error) {
    logger.error('Unhandled API error', error);
  }

  // Handle known error types
  if (error instanceof ApiError) {
    const response: ApiErrorResponse = {
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (error.statusCode === 429) {
      headers['Retry-After'] = '60';
    }

    return NextResponse.json(response, { status: error.statusCode, headers });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ApiErrorResponse = {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 400 });
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    const response: ApiErrorResponse = {
      error: 'Invalid JSON in request body',
      code: 'INVALID_JSON',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 400 });
  }

  // Generic error response
  const response: ApiErrorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : (error instanceof Error ? error.message : 'Unknown error'),
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 500 });
}

// Success response helper
export function apiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

// Created response helper
export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

// No content response helper
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
