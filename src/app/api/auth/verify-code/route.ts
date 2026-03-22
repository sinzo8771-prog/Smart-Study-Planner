import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/tokens';
import { db } from '@/lib/db';
import { generateToken, setAuthCookie } from '@/lib/auth';

// POST /api/auth/verify-code - Verify email with code
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format. Please enter a 6-digit code.' },
        { status: 400 }
      );
    }

    // Verify the code
    const result = await verifyCode(code, email, 'email_verification');

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user as verified
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

    console.log('[Auth] Email verified successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
