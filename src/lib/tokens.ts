import crypto from 'crypto';
import { db } from './db';
import { shouldUseStaticData } from './data-service';

// In-memory token store for static/demo mode
const staticTokens = new Map<string, { identifier: string; token: string; code: string | null; type: string; expires: Date }>();

// Generate a secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a verification token with optional code
export async function createVerificationToken(
  identifier: string,
  type: 'email_verification' | 'password_reset',
  expiresInHours: number = 24,
  includeCode: boolean = true
): Promise<{ token: string; code?: string }> {
  const token = generateToken();
  const code = includeCode ? generateVerificationCode() : undefined;
  const expires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  if (shouldUseStaticData()) {
    // Use in-memory store for static/demo mode
    const key = `${identifier}:${type}`;
    staticTokens.delete(key);
    staticTokens.set(key, { identifier, token, code: code || null, type, expires });
    console.log('[Tokens] Static mode: Created token for', identifier);
    return { token, code };
  }

  // Delete any existing tokens for this identifier and type
  await db.verificationToken.deleteMany({
    where: { identifier, type },
  });

  // Create new token
  await db.verificationToken.create({
    data: {
      identifier,
      token,
      code,
      type,
      expires,
    },
  });

  return { token, code };
}

// Verify a token
export async function verifyToken(
  token: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ valid: boolean; identifier?: string; error?: string }> {
  if (shouldUseStaticData()) {
    // Use in-memory store for static/demo mode
    for (const [key, data] of staticTokens.entries()) {
      if (data.token === token && data.type === type) {
        if (data.expires < new Date()) {
          staticTokens.delete(key);
          return { valid: false, error: 'Token has expired' };
        }
        staticTokens.delete(key);
        return { valid: true, identifier: data.identifier };
      }
    }
    return { valid: false, error: 'Invalid token' };
  }

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

// Verify a code (for email verification)
export async function verifyCode(
  code: string,
  email: string,
  type: 'email_verification' | 'password_reset' = 'email_verification'
): Promise<{ valid: boolean; identifier?: string; error?: string }> {
  if (shouldUseStaticData()) {
    // Use in-memory store for static/demo mode
    const key = `${email.toLowerCase().trim()}:${type}`;
    const data = staticTokens.get(key);
    
    if (!data || data.code !== code) {
      return { valid: false, error: 'Invalid verification code' };
    }

    if (data.expires < new Date()) {
      staticTokens.delete(key);
      return { valid: false, error: 'Verification code has expired' };
    }

    staticTokens.delete(key);
    return { valid: true, identifier: data.identifier };
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: { 
      code,
      identifier: email.toLowerCase().trim(),
      type,
    },
  });

  if (!verificationToken) {
    return { valid: false, error: 'Invalid verification code' };
  }

  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await db.verificationToken.delete({ where: { id: verificationToken.id } });
    return { valid: false, error: 'Verification code has expired' };
  }

  // Delete the token after verification (one-time use)
  await db.verificationToken.delete({ where: { id: verificationToken.id } });

  return { valid: true, identifier: verificationToken.identifier };
}

// Get verification token info by email (for resending)
export async function getVerificationTokenByEmail(
  email: string,
  type: 'email_verification' | 'password_reset' = 'email_verification'
): Promise<{ token: string; code: string | null; expires: Date } | null> {
  if (shouldUseStaticData()) {
    const key = `${email.toLowerCase().trim()}:${type}`;
    const data = staticTokens.get(key);
    if (!data) return null;
    return {
      token: data.token,
      code: data.code,
      expires: data.expires,
    };
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: { 
      identifier: email.toLowerCase().trim(),
      type,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!verificationToken) {
    return null;
  }

  return {
    token: verificationToken.token,
    code: verificationToken.code,
    expires: verificationToken.expires,
  };
}

// Delete all tokens for an identifier
export async function deleteTokensForIdentifier(
  identifier: string,
  type?: 'email_verification' | 'password_reset'
): Promise<void> {
  if (shouldUseStaticData()) {
    if (type) {
      staticTokens.delete(`${identifier}:${type}`);
    } else {
      // Delete all types
      for (const key of staticTokens.keys()) {
        if (key.startsWith(`${identifier}:`)) {
          staticTokens.delete(key);
        }
      }
    }
    return;
  }

  await db.verificationToken.deleteMany({
    where: type ? { identifier, type } : { identifier },
  });
}
