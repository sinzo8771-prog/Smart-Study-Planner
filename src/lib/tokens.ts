import crypto from 'crypto';
import { db } from './db';

// Generate a secure random token (for password reset links)
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate a 6-digit verification code (for email verification)
export function generateVerificationCode(): string {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a verification token (returns code for email_verification, token for password_reset)
export async function createVerificationToken(
  identifier: string,
  type: 'email_verification' | 'password_reset',
  expiresInHours: number = 24
): Promise<string> {
  // Use 6-digit code for email verification, long token for password reset
  const token = type === 'email_verification' ? generateVerificationCode() : generateToken();
  const expires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  // Delete any existing tokens for this identifier and type
  await db.verificationToken.deleteMany({
    where: { identifier, type },
  });

  // Create new token
  await db.verificationToken.create({
    data: {
      identifier,
      token,
      type,
      expires,
    },
  });

  return token;
}

// Verify a token or code
export async function verifyToken(
  token: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ valid: boolean; identifier?: string; error?: string }> {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { valid: false, error: 'Invalid verification code' };
  }

  if (verificationToken.type !== type) {
    return { valid: false, error: 'Invalid token type' };
  }

  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await db.verificationToken.delete({ where: { token } });
    return { valid: false, error: 'Verification code has expired' };
  }

  // Delete the token after verification (one-time use)
  await db.verificationToken.delete({ where: { token } });

  return { valid: true, identifier: verificationToken.identifier };
}

// Get verification token info (without deleting)
export async function getVerificationToken(
  identifier: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ token: string; expires: Date } | null> {
  const verificationToken = await db.verificationToken.findFirst({
    where: { identifier, type },
  });

  if (!verificationToken) {
    return null;
  }

  return { token: verificationToken.token, expires: verificationToken.expires };
}

// Delete all tokens for an identifier
export async function deleteTokensForIdentifier(
  identifier: string,
  type?: 'email_verification' | 'password_reset'
): Promise<void> {
  await db.verificationToken.deleteMany({
    where: type ? { identifier, type } : { identifier },
  });
}
