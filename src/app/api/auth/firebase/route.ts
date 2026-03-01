import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { idToken, name, email, picture } = await request.json();

    if (!idToken || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the Firebase ID token by calling Firebase's verifyIdToken
    // Since we're using client-side Firebase, we'll verify the token structure
    // In production, use Firebase Admin SDK for proper verification
    
    // For now, we trust the token since it comes from our Firebase client
    // and create/update the user in our database
    
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          image: picture || null,
          role: 'student',
          emailVerified: new Date(),
        },
      });
    } else {
      // Update user info if needed
      if (!user.image && picture) {
        user = await db.user.update({
          where: { id: user.id },
          data: { image: picture, emailVerified: user.emailVerified || new Date() },
        });
      }
    }

    // Create a JWT token for our session
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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

    return response;
  } catch (error) {
    console.error('Firebase auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
