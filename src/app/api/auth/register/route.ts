import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/auth';
import { createVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
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

    // Create user (unverified)
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Create verification token
    const token = await createVerificationToken(email, 'email_verification', 24);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, name, token);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Still return success but indicate email might need resend
      return NextResponse.json({
        success: true,
        message: 'Account created but verification email could not be sent. Please try resending.',
        requiresVerification: true,
        email: email,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      requiresVerification: true,
      email: email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
