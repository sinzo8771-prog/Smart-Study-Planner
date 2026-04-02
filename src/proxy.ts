import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const securityHeaders: Record<string, string> = {
  
  'X-Frame-Options': 'SAMEORIGIN',
  
  'X-Content-Type-Options': 'nosniff',
  
  'X-XSS-Protection': '1; mode=block',
  
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};


const rateLimitStore = new Map<string, { count: number; resetTime: number }>();


const rateLimitConfig = {
  windowMs: 60 * 1000, 
  maxRequests: 100, 
};


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


if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(ip);
      }
    }
  }, 60 * 1000);
}


const getAllowedOrigins = () => {
  const origins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();


export function proxy(request: NextRequest) {
  
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  
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

  
  const response = NextResponse.next();

  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    
    const isAllowed = origin && (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
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

  return response;
}


export const config = {
  matcher: [
    
    '/((?!_next/static|_next/image|favicon.ico|public/|images/).*)',
  ],
};
