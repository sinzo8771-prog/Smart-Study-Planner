import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, generateToken, setAuthCookie } from '@/lib/auth';
import { createVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/validation';
import { shouldUseStaticData } from '@/lib/data-service';

// Check if email service is configured (Gmail SMTP)
function isEmailServiceConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function POST(request: NextRequest) {
  console.log('[Register API] POST request received');
  
  try {
    // Rate limiting - 3 registrations per hour per IP
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

    // Validate input
    if (!name || !email || !password) {
      console.log('[Register API] Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[Register API] Invalid email format');
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      console.log('[Register API] Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for password complexity
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

    // Check if user already exists
    console.log('[Register API] Checking if user exists...');
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('[Register API] User already exists');
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    console.log('[Register API] Creating user...');
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'student',
    });
    console.log('[Register API] User created:', user.id);

    // Check if we're in static/demo mode (Vercel without database)
    const isStaticMode = shouldUseStaticData();
    console.log('[Register API] Static mode:', isStaticMode);
    
    // Check if email service is configured
    const emailConfigured = isEmailServiceConfigured();
    console.log('[Register API] Email configured:', emailConfigured);

    // In static mode OR when email is not configured, auto-verify and log in
    if (isStaticMode || !emailConfigured) {
      // Demo/Development mode: Auto-verify user and log them in
      console.log('[Register API] Demo/Development mode: Auto-verifying user', email);
      
      // Generate token and set cookie for auto-login
      console.log('[Register API] Generating token...');
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      console.log('[Register API] Setting auth cookie...');
      await setAuthCookie(token);

      console.log('[Register API] Registration successful');
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! You are now logged in.',
        autoVerified: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // Production mode with database: Send verification email with code
    console.log('[Register API] Production mode: Sending verification email...');
    const { token, code } = await createVerificationToken(email, 'email_verification', 24, true);
    
    if (!code) {
      console.error('[Register API] Failed to generate verification code');
      // Fall back to auto-verify
      const jwtToken = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      await setAuthCookie(jwtToken);
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! You are now logged in.',
        autoVerified: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    const emailResult = await sendVerificationEmail(email, name, code, token);
    
    if (!emailResult.success) {
      console.error('[Register API] Failed to send verification email:', emailResult.error);
      return NextResponse.json({
        success: true,
        message: 'Account created but verification email could not be sent. Please try resending.',
        requiresVerification: true,
        email: email,
      });
    }

    console.log('[Register API] Verification email sent');
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! A verification code has been sent to your email.',
      requiresVerification: true,
      email: email,
    });
  } catch (error) {
    console.error('[Register API] Registration error:', error);
    console.error('[Register API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'An error occurred during registration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
