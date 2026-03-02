import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { createVerificationToken, deleteTokensForIdentifier } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    }

    // Check if user has password (OAuth users might not)
    if (!user.password) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    }

    // Delete old reset tokens and create new one (6-digit code, 1 hour expiry)
    await deleteTokensForIdentifier(email, 'password_reset');
    const code = await createVerificationToken(email, 'password_reset', 1); // 1 hour expiry

    // Send password reset email with code
    const emailResult = await sendPasswordResetEmail(email, user.name, code);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json({
        success: false,
        error: `Failed to send verification email: ${emailResult.error}. Please try again.`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
