import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

// Hardcoded admin credentials - in production, use environment variables
const ADMIN_CREDENTIALS = {
  email: 'admin@studyplanner.com',
  password: 'Admin@123456',
  name: 'Admin',
  role: 'admin',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check admin credentials (case-insensitive email)
    if (
      email.toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase() ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Generate admin token
    const token = generateToken({
      id: 'admin-001',
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    });

    // Create response and set cookie directly
    const response = NextResponse.json({
      success: true,
      user: {
        id: 'admin-001',
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        image: null,
      },
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during admin login' },
      { status: 500 }
    );
  }
}
