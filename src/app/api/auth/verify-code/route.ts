import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/tokens';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format. Please enter a 6-digit code.' },
        { status: 400 }
      );
    }

    
    const result = await verifyCode(code, email, 'email_verification');

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    console.log('[Auth] Email verified successfully for:', email);

    
    const response = NextResponse.json({
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
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
