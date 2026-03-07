// Shared authentication helpers for API routes
// Supports both NextAuth session and custom JWT authentication

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getCurrentUser } from '@/lib/auth';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Get the authenticated user from either auth system
 * First tries NextAuth session (for Google OAuth), then falls back to custom JWT
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  console.log('[AuthHelper] getAuthenticatedUser called');
  
  // First try NextAuth session (for Google OAuth via NextAuth)
  try {
    const nextAuthSession = await getServerSession(authOptions);
    console.log('[AuthHelper] NextAuth session result:', nextAuthSession ? 'found' : 'not found');
    if (nextAuthSession?.user) {
      console.log('[AuthHelper] Using NextAuth session for:', nextAuthSession.user.email);
      return {
        id: nextAuthSession.user.id,
        email: nextAuthSession.user.email || '',
        name: nextAuthSession.user.name || '',
        role: (nextAuthSession.user as { role?: string }).role || 'student',
      };
    }
  } catch (error) {
    console.log('[AuthHelper] NextAuth session check failed:', error instanceof Error ? error.message : error);
  }

  // Fall back to custom JWT auth
  console.log('[AuthHelper] Falling back to custom JWT auth');
  const user = await getCurrentUser();
  console.log('[AuthHelper] Custom JWT auth result:', user ? `found: ${user.email}` : 'not found');
  return user;
}
