import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyCode } from '@/lib/tokens';
import { hashPassword, generateToken, findUserByEmail } from '@/lib/auth';
import { shouldUseStaticData } from '@/lib/data-service';


function createAuthResponse(data: object, token: string) {
  const response = NextResponse.json(data);
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { token, code, email, password, confirmPassword } = await request.json();

    
    let identifier: string | undefined;

    if (token) {
      
      const result = await verifyToken(token, 'password_reset');
      if (!result.valid) {
        return NextResponse.json(
          { error: result.error || 'Invalid or expired reset token' },
          { status: 400 }
        );
      }
      identifier = result.identifier;
    } else if (code && email) {
      
      const result = await verifyCode(code, email, 'password_reset');
      if (!result.valid) {
        return NextResponse.json(
          { error: result.error || 'Invalid or expired verification code' },
          { status: 400 }
        );
      }
      identifier = result.identifier;
    } else {
      return NextResponse.json(
        { error: 'Token or verification code is required' },
        { status: 400 }
      );
    }

    
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirmation are required' },
        { status: 400 }
      );
    }

    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    
    const user = await findUserByEmail(identifier);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    
    if (shouldUseStaticData()) {
      console.log('[Reset Password] Static mode: Password reset simulated for', identifier);
      
      
      const authToken = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return createAuthResponse({
        success: true,
        message: 'Password reset successfully! (Demo mode - password not actually changed)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }, authToken);
    }

    
    const hashedPassword = await hashPassword(password);

    
    const { db } = await import('@/lib/db');

    
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        emailVerified: user.emailVerified || new Date(), 
      },
    });

    
    const authToken = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    return createAuthResponse({
      success: true,
      message: 'Password reset successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    }, authToken);
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred during password reset' },
      { status: 500 }
    );
  }
}
