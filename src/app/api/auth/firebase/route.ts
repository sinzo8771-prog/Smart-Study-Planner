import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { getUserByEmail, createUser, updateUser, shouldUseStaticData } from '@/lib/data-service';
import { checkRateLimit } from '@/lib/validation';
import { addRegisteredUser } from '@/lib/static-data';

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

    // idToken is optional in static/demo mode since we trust the client-side Firebase auth
    const isStaticMode = shouldUseStaticData();
    if (!isStaticMode && !idToken) {
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
      // Create new user with emailVerified since Google verifies emails
      const userData = {
        email,
        name: name || email.split('@')[0],
        image: picture || null,
        role: 'student' as const,
        emailVerified: new Date(), // Google has verified this email
      };
      
      if (isStaticMode) {
        // In static mode, create user in memory store
        const newUser = {
          id: `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...userData,
          password: undefined, // No password for Google users
        };
        addRegisteredUser(newUser);
        user = newUser;
        console.log('Firebase auth: Created new Google user in static mode:', user.id);
      } else {
        user = await createUser({
          ...userData,
          password: '', // Empty password for Google users - they use OAuth
        });
        console.log('Firebase auth: Created new user:', user.id);
      }
    } else {
      // Update user info if needed
      if (!user.image && picture) {
        user = await updateUser(user.id, { 
          image: picture, 
          emailVerified: user.emailVerified || new Date() 
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

    // Set auth cookie using centralized function
    await setAuthCookie(token);

    console.log('Firebase auth: Successfully authenticated user:', user.id);
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      }
    });
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
