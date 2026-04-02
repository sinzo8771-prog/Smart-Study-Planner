// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS attacks
 * Uses iterative replacement to handle multi-character sanitization bypass attempts
 * as recommended by CodeQL (js/incomplete-multi-character-sanitization)
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  let sanitized = input;
  let previous: string;
  
  // Iteratively apply sanitization until no more changes occur
  // This prevents bypass attempts like "ononload=" -> "onload="
  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .replace(/url\s*\(/gi, '') // Remove CSS url() for safety
      .replace(/&#/g, '') // Remove HTML entity encodings
      .replace(/&lt/gi, '') // Remove encoded <
      .replace(/&gt/gi, ''); // Remove encoded >
  } while (sanitized !== previous);
  
  // Remove any remaining dangerous characters and normalize whitespace
  return sanitized
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '') // Remove control characters
    .trim();
}

/**
 * Validate email format
 * Uses a safe regex pattern to prevent ReDoS attacks
 */
export function isValidEmail(email: string): boolean {
  // Prevent ReDoS by limiting input length first
  if (!email || email.length > 254) {
    return false;
  }

  // Check basic structure without using vulnerable regex patterns
  // Must have exactly one @ symbol
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return false;
  }

  // Split and validate parts
  const [localPart, domain] = email.split('@');
  
  // Local part must be non-empty and not too long (max 64 chars per RFC)
  if (!localPart || localPart.length > 64) {
    return false;
  }

  // Domain must be non-empty, contain a dot, and not be too long
  if (!domain || domain.length > 253 || !domain.includes('.')) {
    return false;
  }

  // Check for no whitespace characters
  if (/\s/.test(email)) {
    return false;
  }

  // Validate domain has at least one dot with content on both sides
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
    return false;
  }

  // Check TLD is at least 2 characters
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return false;
  }

  return true;
}

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

/**
 * Validate name (no special characters, reasonable length)
 */
export function isValidName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validate ID (CUID or UUID format)
 */
export function isValidId(id: string): boolean {
  // CUID format (used by Prisma)
  const cuidRegex = /^[a-z0-9]{25}$/;
  // UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Static IDs for demo mode
  const staticIdRegex = /^(course|quiz|subject|task|mod|user|admin)-[\w-]+$/i;
  
  return cuidRegex.test(id) || uuidRegex.test(id) || staticIdRegex.test(id);
}

/**
 * Sanitize object by sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}

/**
 * Validate role
 */
export function isValidRole(role: string): boolean {
  return ['student', 'admin'].includes(role);
}

/**
 * Validate task status
 */
export function isValidTaskStatus(status: string): boolean {
  return ['pending', 'in_progress', 'completed'].includes(status);
}

/**
 * Validate task priority
 */
export function isValidTaskPriority(priority: string): boolean {
  return ['low', 'medium', 'high'].includes(priority);
}

/**
 * Validate course level
 */
export function isValidCourseLevel(level: string): boolean {
  return ['beginner', 'intermediate', 'advanced'].includes(level);
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
