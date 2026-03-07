import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyCode } from '@/lib/tokens';
import { hashPassword, generateToken, setAuthCookie, findUserByEmail } from '@/lib/auth';
import { shouldUseStaticData } from '@/lib/data-service';

export async function POST(request: NextRequest) {
  try {
    const { token, code, email, password, confirmPassword } = await request.json();

    // Support both token-based and code-based reset
    let identifier: string | undefined;

    if (token) {
      // Token-based reset (from email link)
      const result = await verifyToken(token, 'password_reset');
      if (!result.valid) {
        return NextResponse.json(
          { error: result.error || 'Invalid or expired reset token' },
          { status: 400 }
        );
      }
      identifier = result.identifier;
    } else if (code && email) {
      // Code-based reset (from verification code input)
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

    // Validate password
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirmation are required' },
        { status: 400 }
      );
    }

    // Check password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
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

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await findUserByEmail(identifier);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // In static mode, just return success (password can't be changed in demo mode)
    if (shouldUseStaticData()) {
      console.log('[Reset Password] Static mode: Password reset simulated for', identifier);
      
      // Generate auth token and set cookie
      const authToken = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      await setAuthCookie(authToken);

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! (Demo mode - password not actually changed)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // Database mode: Hash and update password
    const hashedPassword = await hashPassword(password);

    // Import db only when needed
    const { db } = await import('@/lib/db');

    // Update user password
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        emailVerified: user.emailVerified || new Date(), // Verify email if not already
      },
    });

    // Generate auth token and set cookie
    const authToken = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    await setAuthCookie(authToken);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred during password reset' },
      { status: 500 }
    );
  }
}
