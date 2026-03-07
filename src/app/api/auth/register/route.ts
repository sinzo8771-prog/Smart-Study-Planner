import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, generateToken, setAuthCookie } from '@/lib/auth';
import { createVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/validation';
import { db } from '@/lib/db';

// Check if email service is configured (Gmail SMTP)
function isEmailServiceConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function POST(request: NextRequest) {
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

    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
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
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Check if email service is configured
    const emailConfigured = isEmailServiceConfigured();

    if (emailConfigured) {
      // Production mode: Send verification email with code
      const { token, code } = await createVerificationToken(email, 'email_verification', 24, true);
      
      if (!code) {
        console.error('Failed to generate verification code');
        // Fall back to auto-verify
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
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
        console.error('Failed to send verification email:', emailResult.error);
        return NextResponse.json({
          success: true,
          message: 'Account created but verification email could not be sent. Please try resending.',
          requiresVerification: true,
          email: email,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Account created successfully! A verification code has been sent to your email.',
        requiresVerification: true,
        email: email,
      });
    } else {
      // Development/Demo mode: Auto-verify user and log them in
      console.log('[Auth] Development mode: Auto-verifying user', email);
      
      // Update user to verified
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      // Generate token and set cookie for auto-login
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      await setAuthCookie(token);

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
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
