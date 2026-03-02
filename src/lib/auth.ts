import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Verify user still exists in database
  const user = await db.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}

// Get user from database with full data
export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });
}

// Create new user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const hashedPassword = await hashPassword(data.password);

  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });
}

// Find user by email
export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  });
}
