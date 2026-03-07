import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { getUserByEmail, createUser, updateUser } from '@/lib/data-service';
import { checkRateLimit } from '@/lib/validation';

// JWT secret is now handled centrally in lib/auth.ts - no fallback allowed

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`firebase-auth:${ip}`, 10, 60000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many authentication attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { idToken, name, email, picture } = body;

    // Validate required fields
    if (!email) {
      console.error('Firebase auth error: Missing email');
      return NextResponse.json({ 
        success: false,
        error: 'Email is required for authentication' 
      }, { status: 400 });
    }

    if (!idToken) {
      console.error('Firebase auth error: Missing idToken');
      return NextResponse.json({ 
        success: false,
        error: 'Authentication token is required' 
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Firebase auth error: Invalid email format:', email);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    console.log('Firebase auth: Processing login for email:', email);

    // Find or create user
    let user = await getUserByEmail(email);

    if (!user) {
      // Create new user
      user = await createUser({
        email,
        name: name || email.split('@')[0],
        image: picture || null,
        role: 'student',
      });
      console.log('Firebase auth: Created new user:', user.id);
    } else {
      // Update user info if needed
      if (!user.image && picture) {
        user = await updateUser(user.id, { 
          image: picture, 
          emailVerified: new Date() 
        });
      }
      console.log('Firebase auth: Found existing user:', user.id);
    }

    // Create a JWT token for our session using centralized auth
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      }
    });

    // Set the auth cookie with security settings
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Allows cookies with same-site requests
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('Firebase auth: Successfully authenticated user:', user.id);
    return response;
  } catch (error) {
    console.error('Firebase auth error: Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
