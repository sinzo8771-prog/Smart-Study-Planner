import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, generateToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/validation';
import { shouldUseStaticData } from '@/lib/data-service';


function createAuthResponse(data: object, token: string) {
  const response = NextResponse.json(data);
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  });
  return response;
}

export async function POST(request: NextRequest) {
  console.log('[Register API] POST request received');
  
  try {
    
    const isStaticMode = shouldUseStaticData();
    console.log('[Register API] Static mode:', isStaticMode);
    
    
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`register:${ip}`, 3, 3600000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;
    
    console.log('[Register API] Request body:', { name, email, role, hasPassword: !!password });

    
    if (!name || !email || !password) {
      console.log('[Register API] Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[Register API] Invalid email format');
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    
    if (password.length < 8) {
      console.log('[Register API] Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      console.log('[Register API] Password complexity failed');
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    
    console.log('[Register API] Checking if user exists...');
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('[Register API] User already exists');
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    
    console.log('[Register API] Creating user...');
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'student',
    });
    console.log('[Register API] User created:', user.id);

    
    console.log('[Register API] Generating token...');
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    
    console.log('[Register API] Registration successful');
    return createAuthResponse({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, token);
  } catch (error) {
    console.error('[Register API] Registration error:', error);
    console.error('[Register API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'An error occurred during registration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
