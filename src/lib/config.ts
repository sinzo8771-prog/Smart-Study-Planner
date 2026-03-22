// Environment configuration with validation

// Required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'DATABASE_URL',
] as const;

// Optional environment variables with defaults
const optionalEnvVars = {
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: '587',
  SMTP_USER: '',
  SMTP_PASS: '',
  EMAIL_FROM: '',
  NEXT_PUBLIC_FIREBASE_API_KEY: '',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: '',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: '',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',
  NEXTAUTH_SECRET: '',
  NEXT_PUBLIC_ENABLE_REGISTRATION: 'true',
  NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN: 'true',
} as const;

// Validate required environment variables
function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

// Get environment variable with fallback
export function getEnv<K extends keyof typeof optionalEnvVars>(
  key: K
): string {
  return process.env[key] || optionalEnvVars[key];
}

// Check if feature is enabled
export function isFeatureEnabled(feature: string): boolean {
  const key = `NEXT_PUBLIC_ENABLE_${feature.toUpperCase()}` as keyof typeof optionalEnvVars;
  return getEnv(key) === 'true';
}

// App configuration
export const config = {
  // App settings
  app: {
    url: getEnv('NEXT_PUBLIC_APP_URL'),
    name: 'Smart Study Planner',
    version: '1.0.0',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    sessionMaxAge: 7 * 24 * 60 * 60, // 7 days
  },

  // Email settings
  email: {
    host: getEnv('SMTP_HOST'),
    port: parseInt(getEnv('SMTP_PORT')),
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
    from: getEnv('EMAIL_FROM') || getEnv('SMTP_USER'),
    isConfigured: !!(getEnv('SMTP_USER') && getEnv('SMTP_PASS')),
  },

  // Feature flags
  features: {
    registration: isFeatureEnabled('REGISTRATION'),
    googleLogin: isFeatureEnabled('GOOGLE_LOGIN'),
  },

  // Security settings
  security: {
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100,
    },
    bcryptSaltRounds: 12,
  },
} as const;

// Validate on import in production
if (typeof window === 'undefined') {
  validateEnv();
}

export default config;
