import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

// Cache control for session endpoint
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // First check for NextAuth session (Google OAuth)
    const nextAuthSession = await getServerSession(authOptions);

    if (nextAuthSession?.user) {
      return NextResponse.json({
        user: {
          id: nextAuthSession.user.id,
          email: nextAuthSession.user.email,
          name: nextAuthSession.user.name,
          role: nextAuthSession.user.role,
          image: nextAuthSession.user.image,
        },
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      });
    }

    // Fall back to custom JWT auth
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
