import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers configuration
const securityHeaders = {
  // Prevent clickjacking - but allow same-origin for OAuth
  'X-Frame-Options': 'SAMEORIGIN',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // XSS protection
  'X-XSS-Protection': '1; mode=block',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com https://www.gstatic.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://apis.google.com https://firestore.googleapis.com https://firebaseinstallations.googleapis.com https://firebaseappcheck.googleapis.com",
    "frame-src 'self' https://gen-lang-client-0486911785.firebaseapp.com https://*.firebaseapp.com https://*.google.com https://accounts.google.com https://apis.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '),
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // max requests per window
};

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + rateLimitConfig.windowMs });
    return true;
  }

  if (record.count >= rateLimitConfig.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 1000);

// CORS configuration - Allow all Vercel preview/production URLs and localhost
const getAllowedOrigins = () => {
  const origins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  // In production, also allow the Vercel URL
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  // Allow all vercel.app subdomains for preview deployments
  // This is handled dynamically in the CORS check below
  return origins;
};

const allowedOrigins = getAllowedOrigins();

export function middleware(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Apply rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  // Handle CORS preflight for API routes first
  if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const isAllowed = origin && (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    );
    
    const headers: Record<string, string> = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cookie',
      'Access-Control-Max-Age': '86400',
    };
    
    if (isAllowed && origin) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    return new NextResponse(null, { status: 204, headers });
  }

  // Continue to the route handler
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    // Check if origin is allowed (static list or vercel.app subdomain)
    const isAllowed = origin && (
      allowedOrigins.includes(origin) ||
      // Allow any vercel.app subdomain for preview deployments
      origin.endsWith('.vercel.app') ||
      // Allow localhost on any port
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    );
    
    if (isAllowed && origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cookie');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
  }

  // Log API requests in development
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname} - IP: ${ip}`);
  }

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
