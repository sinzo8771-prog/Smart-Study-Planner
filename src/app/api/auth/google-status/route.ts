import { NextResponse } from 'next/server';

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const isConfigured = !!(googleClientId && googleClientSecret && 
    googleClientId.length > 0 && googleClientSecret.length > 0);

  return NextResponse.json({ configured: isConfigured });
}
