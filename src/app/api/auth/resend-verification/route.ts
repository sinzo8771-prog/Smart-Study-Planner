import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { createVerificationToken, deleteTokensForIdentifier } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('Resend verification request for:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification email has been sent.',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified. You can log in.',
      });
    }

    // Delete old tokens and create new one
    await deleteTokensForIdentifier(email, 'email_verification');
    const token = await createVerificationToken(email, 'email_verification', 24);

    console.log('Generated verification code:', token);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, user.name, token);

    console.log('Email result:', emailResult);

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        error: `Failed to send verification email: ${emailResult.error}. Please try again.`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
