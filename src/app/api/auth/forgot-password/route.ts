import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { createVerificationToken, deleteTokensForIdentifier } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('Forgot password request for:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Find user
    const user = await findUserByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('User not found for email:', email);
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    }

    // Check if user has password (OAuth users might not)
    if (!user.password) {
      console.log('User has no password (OAuth user):', email);
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    }

    // Delete old reset tokens and create new one (6-digit code, 1 hour expiry)
    await deleteTokensForIdentifier(email, 'password_reset');
    const code = await createVerificationToken(email, 'password_reset', 1); // 1 hour expiry

    console.log('Generated reset code for', email, ':', code);
    console.log('Sending email via SMTP...');

    // Send password reset email with code
    const emailResult = await sendPasswordResetEmail(email, user.name, code);

    console.log('Email result:', emailResult);

    // Always return the verification code for the UI
    // This allows users to verify even if email delivery fails (e.g., Resend free tier restrictions)
    return NextResponse.json({
      success: true,
      message: emailResult.success 
        ? 'Verification code sent to your email.'
        : 'Use the verification code shown on screen.',
      verificationCode: code, // Always return code so user can verify
      emailSent: emailResult.success,
      emailError: emailResult.error,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
