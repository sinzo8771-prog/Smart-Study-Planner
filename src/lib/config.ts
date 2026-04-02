


const requiredEnvVars = [
  'JWT_SECRET',
  'DATABASE_URL',
] as const;


const optionalEnvVars = {
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: '587',
  SMTP_USER: '',
  SMTP_PASS: '',
  EMAIL_FROM: '',
  NEXTAUTH_SECRET: '',
  NEXT_PUBLIC_ENABLE_REGISTRATION: 'true',
} as const;


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


export function getEnv<K extends keyof typeof optionalEnvVars>(
  key: K
): string {
  return process.env[key] || optionalEnvVars[key];
}


export function isFeatureEnabled(feature: string): boolean {
  const key = `NEXT_PUBLIC_ENABLE_${feature.toUpperCase()}` as keyof typeof optionalEnvVars;
  return getEnv(key) === 'true';
}


export const config = {
  
  app: {
    url: getEnv('NEXT_PUBLIC_APP_URL'),
    name: 'Smart Study Planner',
    version: '1.0.0',
    isProduction: process.env.NODE_ENV === 'production',
  },

  
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    sessionMaxAge: 7 * 24 * 60 * 60, 
  },

  
  email: {
    host: getEnv('SMTP_HOST'),
    port: parseInt(getEnv('SMTP_PORT')),
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
    from: getEnv('EMAIL_FROM') || getEnv('SMTP_USER'),
    isConfigured: !!(getEnv('SMTP_USER') && getEnv('SMTP_PASS')),
  },

  
  features: {
    registration: isFeatureEnabled('REGISTRATION'),
  },

  
  security: {
    rateLimit: {
      windowMs: 60 * 1000, 
      maxRequests: 100,
    },
    bcryptSaltRounds: 12,
  },
} as const;


if (typeof window === 'undefined') {
  validateEnv();
}

export default config;
