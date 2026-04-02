export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  let sanitized = input;
  let previous: string;
  
  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(/gi, '')
      .replace(/&#/g, '')
      .replace(/&lt/gi, '')
      .replace(/&gt/gi, '');
  } while (sanitized !== previous);
  
  return sanitized
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
    .trim();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) {
    return false;
  }

  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return false;
  }

  const [localPart, domain] = email.split('@');
  
  if (!localPart || localPart.length > 64) {
    return false;
  }

  if (!domain || domain.length > 253 || !domain.includes('.')) {
    return false;
  }

  if (/\s/.test(email)) {
    return false;
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
    return false;
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return false;
  }

  return true;
}

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

  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function isValidId(id: string): boolean {
  const cuidRegex = /^[a-z0-9]{25}$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const staticIdRegex = /^(course|quiz|subject|task|mod|user|admin)-[\w-]+$/i;
  
  return cuidRegex.test(id) || uuidRegex.test(id) || staticIdRegex.test(id);
}

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

export function isValidRole(role: string): boolean {
  return ['student', 'admin'].includes(role);
}

export function isValidTaskStatus(status: string): boolean {
  return ['pending', 'in_progress', 'completed'].includes(status);
}

export function isValidTaskPriority(priority: string): boolean {
  return ['low', 'medium', 'high'].includes(priority);
}

export function isValidCourseLevel(level: string): boolean {
  return ['beginner', 'intermediate', 'advanced'].includes(level);
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
