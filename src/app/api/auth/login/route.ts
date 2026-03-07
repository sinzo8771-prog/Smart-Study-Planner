import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, comparePassword, generateToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/validation';
import { shouldUseStaticData } from '@/lib/data-service';

export async function POST(request: NextRequest) {
  console.log('[Login API] POST request received');
  
  try {
    // Rate limiting - 5 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      );
    }

    const { email, password } = await request.json();
    console.log('[Login API] Email:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    console.log('[Login API] User found:', user ? user.email : 'Not found');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has a password (OAuth users might not)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please sign in with Google.' },
        { status: 401 }
      );
    }

    console.log('[Login API] Comparing passwords...');
    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    console.log('[Login API] Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if email is verified (skip in static/demo mode)
    const isStaticMode = shouldUseStaticData();
    if (!isStaticMode && !user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    console.log('[Login API] Login successful for:', email);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
