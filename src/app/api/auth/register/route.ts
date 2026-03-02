import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/auth';
import { createVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    console.log('Registration request:', { name, email, role });

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
    console.log('Checking if user exists...');
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user (unverified)
    console.log('Creating user...');
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'student',
    });
    console.log('User created:', user.id);

    // Create verification token
    console.log('Creating verification token...');
    const token = await createVerificationToken(email, 'email_verification', 24);
    console.log('Token created:', token);

    // Send verification email
    console.log('Sending verification email...');
    const emailResult = await sendVerificationEmail(email, name, token);
    console.log('Email result:', emailResult);
    
    // Always return the verification code for the UI
    // This allows users to verify even if email delivery fails (e.g., Resend free tier restrictions)
    return NextResponse.json({
      success: true,
      message: emailResult.success 
        ? 'Account created successfully! Please check your email to verify your account.'
        : 'Account created! Use the verification code shown on screen.',
      requiresVerification: true,
      email: email,
      verificationCode: token, // Always return code so user can verify
      emailSent: emailResult.success,
      emailError: emailResult.error,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
