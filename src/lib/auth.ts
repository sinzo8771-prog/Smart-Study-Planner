import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserById as fetchUserById, getUserByEmail as fetchUserByEmail, createUser as createDbUser, shouldUseStaticData } from './data-service';
import { createLogger } from './logger';

const logger = createLogger('Auth');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is required for security. Authentication will fail.');
}

// No fallback secret - requires proper configuration
const SECRET_KEY = JWT_SECRET;

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Hash password with salt rounds of 12 (increased security)
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return bcrypt.hash(password, 12);
}

// Compare password with timing-safe comparison
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token with proper expiration
export function generateToken(payload: UserPayload): string {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not configured. Cannot generate token.');
  }
  return jwt.sign(
    { 
      ...payload,
      iat: Math.floor(Date.now() / 1000),
    },
    SECRET_KEY,
    { 
      expiresIn: '7d',
      issuer: 'smart-study-planner',
      audience: 'smart-study-planner-users',
    }
  );
}

// Verify JWT token with proper error handling
export function verifyToken(token: string): UserPayload | null {
  if (!SECRET_KEY) {
    logger.error('JWT_SECRET is not configured');
    return null;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY, {
      issuer: 'smart-study-planner',
      audience: 'smart-study-planner-users',
    });
    return decoded as UserPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug('Invalid token');
    }
    return null;
  }
}

// Set auth cookie with security settings
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Allows cookies with same-site requests and top-level navigations
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// Get current user from cookie with proper verification
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    logger.debug(`Token exists: ${!!token}`);
    
    if (!token) {
      logger.debug('No token found in cookies');
      logger.debug(`Available cookies: ${cookieStore.getAll().map(c => c.name).join(', ')}`);
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      logger.debug('Token verification failed');
      // Clear invalid token
      await clearAuthCookie();
      return null;
    }

    // Verify user still exists in database
    const user = await fetchUserById(payload.id);
    if (!user) {
      logger.debug(`User not found in database: ${payload.id}`);
      await clearAuthCookie();
      return null;
    }

    logger.debug(`Success for user: ${user.email}`);
    
    // Return user data from database (not from token) for security
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    logger.error('getCurrentUser error');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// Get user from database with full data
export async function getUserById(id: string) {
  if (!id) return null;
  return fetchUserById(id);
}

// Create new user with validation
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ id: string; email: string; name: string; role: string; emailVerified: Date | null }> {
  // Validate inputs
  if (!data.name || !data.email || !data.password) {
    throw new Error('Name, email, and password are required');
  }

  if (!['student', 'admin'].includes(data.role)) {
    throw new Error('Invalid role');
  }

  const hashedPassword = await hashPassword(data.password);
  
  return createDbUser({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: hashedPassword,
    role: data.role,
  });
}

// Find user by email
export async function findUserByEmail(email: string) {
  if (!email) return null;
  return fetchUserByEmail(email.toLowerCase().trim());
}

// Check if user is admin
export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === 'admin';
}

// Check if user owns resource
export function isResourceOwner(user: UserPayload | null, resourceUserId: string): boolean {
  return user?.id === resourceUserId;
}
