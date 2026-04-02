import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { createVerificationToken, deleteTokensForIdentifier } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`forgot-password:${ip}`, 3, 3600000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    
    const user = await findUserByEmail(email);

    if (!user) {
      
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent.',
        requiresCodeInput: true,
      });
    }

    
    if (!user.password) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent.',
        requiresCodeInput: true,
      });
    }

    
    await deleteTokensForIdentifier(email, 'password_reset');
    const { token, code } = await createVerificationToken(email, 'password_reset', 1); 

    
    if (code) {
      const emailResult = await sendPasswordResetEmail(email, user.name, code, token);

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error);
        
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset code has been sent.',
      requiresCodeInput: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
