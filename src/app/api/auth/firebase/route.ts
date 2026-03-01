import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, name, email, picture } = body;

    // Validate required fields
    if (!email) {
      console.error('Firebase auth error: Missing email');
      return NextResponse.json({ 
        success: false,
        error: 'Email is required for authentication' 
      }, { status: 400 });
    }

    if (!idToken) {
      console.error('Firebase auth error: Missing idToken');
      return NextResponse.json({ 
        success: false,
        error: 'Authentication token is required' 
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Firebase auth error: Invalid email format:', email);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    console.log('Firebase auth: Processing login for email:', email);

    // Find or create user
    let user;
    try {
      user = await db.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Firebase auth error: Database query failed:', dbError);
      return NextResponse.json({ 
        success: false,
        error: 'Database connection error. Please try again.' 
      }, { status: 500 });
    }

    if (!user) {
      // Create new user
      try {
        user = await db.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            image: picture || null,
            role: 'student',
            emailVerified: new Date(),
          },
        });
        console.log('Firebase auth: Created new user:', user.id);
      } catch (createError) {
        console.error('Firebase auth error: Failed to create user:', createError);
        return NextResponse.json({ 
          success: false,
          error: 'Failed to create user account. Please try again.' 
        }, { status: 500 });
      }
    } else {
      // Update user info if needed
      try {
        if (!user.image && picture) {
          user = await db.user.update({
            where: { id: user.id },
            data: { 
              image: picture, 
              emailVerified: user.emailVerified || new Date() 
            },
          });
        } else if (!user.emailVerified) {
          // Mark email as verified for OAuth users
          user = await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });
        }
        console.log('Firebase auth: Updated existing user:', user.id);
      } catch (updateError) {
        console.error('Firebase auth warning: Failed to update user (non-critical):', updateError);
        // Continue with the existing user data
      }
    }

    // Create a JWT token for our session
    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (jwtError) {
      console.error('Firebase auth error: Failed to generate token:', jwtError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to create session token' 
      }, { status: 500 });
    }

    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      }
    });

    // Set the auth cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('Firebase auth: Successfully authenticated user:', user.id);
    return response;
  } catch (error) {
    console.error('Firebase auth error: Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
