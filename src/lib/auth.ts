import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserById as fetchUserById, getUserByEmail as fetchUserByEmail, createUser as createDbUser, shouldUseStaticData } from './data-service';
import { createLogger } from './logger';

const logger = createLogger('Auth');

const JWT_SECRET = process.env.JWT_SECRET;

const DEMO_SECRET = 'smart-study-planner-demo-secret-key-2024-secure';

function getSecretKey(): string {
  const isStatic = shouldUseStaticData();
  const key = JWT_SECRET || (isStatic ? DEMO_SECRET : '');
  
  if (!key) {
    logger.error('JWT_SECRET environment variable is required for production. Authentication will fail.');
    console.error('[Auth] ERROR: JWT_SECRET is not set and not in static mode. Auth will fail!');
  }
  
  return key;
}

const startupKey = getSecretKey();
if (startupKey === DEMO_SECRET) {
  logger.info('Using demo secret for static mode. Set JWT_SECRET for production.');
  console.log('[Auth] Using demo secret for static mode');
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error('JWT_SECRET is not configured. Cannot generate token.');
  }
  return jwt.sign(
    { 
      ...payload,
      iat: Math.floor(Date.now() / 1000),
    },
    secretKey,
    { 
      expiresIn: '7d',
      issuer: 'smart-study-planner',
      audience: 'smart-study-planner-users',
    }
  );
}

export function verifyToken(token: string): UserPayload | null {
  const secretKey = getSecretKey();
  if (!secretKey) {
    logger.error('JWT_SECRET is not configured');
    return null;
  }
  try {
    const decoded = jwt.verify(token, secretKey, {
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

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  
  
  
  
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  };
  
  cookieStore.set('auth_token', token, cookieOptions);
  
  console.log('[Auth] Cookie set with options:', JSON.stringify({
    ...cookieOptions,
    isProduction,
    isVercel
  }));
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const debugInfo = {
      hasToken: !!token,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      allCookies: cookieStore.getAll().map(c => c.name),
    };
    console.log('[Auth] getCurrentUser debug:', JSON.stringify(debugInfo));
    
    if (!token) {
      logger.debug('No token found in cookies');
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      logger.debug('Token verification failed');
      
      await clearAuthCookie();
      return null;
    }

    console.log('[Auth] Token payload:', JSON.stringify({ id: payload.id, email: payload.email, role: payload.role }));

    
    
    if (shouldUseStaticData()) {
      console.log('[Auth] Static mode - trusting JWT token for user:', payload.email);
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    }

    
    const user = await fetchUserById(payload.id);
    if (!user) {
      logger.debug(`User not found in database: ${payload.id}`);
      console.log('[Auth] User not found for ID:', payload.id);
      await clearAuthCookie();
      return null;
    }

    logger.debug(`Success for user: ${user.email}`);
    console.log('[Auth] User authenticated:', user.email);
    
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    logger.error('getCurrentUser error');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    console.error('[Auth] getCurrentUser error:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  if (!id) return null;
  return fetchUserById(id);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ id: string; email: string; name: string; role: string; emailVerified: Date | null }> {
  
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

export async function findUserByEmail(email: string) {
  if (!email) return null;
  return fetchUserByEmail(email.toLowerCase().trim());
}

export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === 'admin';
}

export function isResourceOwner(user: UserPayload | null, resourceUserId: string): boolean {
  return user?.id === resourceUserId;
}
