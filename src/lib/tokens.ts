import crypto from 'crypto';
import { db } from './db';

// Generate a secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create a verification token
export async function createVerificationToken(
  identifier: string,
  type: 'email_verification' | 'password_reset',
  expiresInHours: number = 24
): Promise<string> {
  const token = generateToken();
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

// Verify a token
export async function verifyToken(
  token: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ valid: boolean; identifier?: string; error?: string }> {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { valid: false, error: 'Invalid token' };
  }

  if (verificationToken.type !== type) {
    return { valid: false, error: 'Invalid token type' };
  }

  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await db.verificationToken.delete({ where: { token } });
    return { valid: false, error: 'Token has expired' };
  }

  // Delete the token after verification (one-time use)
  await db.verificationToken.delete({ where: { token } });

  return { valid: true, identifier: verificationToken.identifier };
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
