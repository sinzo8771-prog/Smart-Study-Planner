import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  const debugInfo = {
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    vercelUrl: process.env.VERCEL_URL,
    allCookieNames: allCookies.map(c => c.name),
    hasAuthToken: allCookies.some(c => c.name === 'auth_token'),
    authTokenValue: cookieStore.get('auth_token')?.value ? 'present (hidden)' : 'not found',
  };
  
  console.log('[Debug Cookies]', JSON.stringify(debugInfo));
  
  return NextResponse.json(debugInfo);
}
