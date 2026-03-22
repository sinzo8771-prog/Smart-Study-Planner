import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ user: null, session: null })
    }

    // Get user from our database
    const dbUser = await db.user.findUnique({
      where: { email: session.user.email?.toLowerCase() }
    })

    if (!dbUser) {
      return NextResponse.json({ user: null, session: null })
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        image: dbUser.image,
      },
      session: {
        accessToken: session.access_token,
        expiresAt: session.expires_at,
      }
    })
  } catch (error) {
    console.error('Error getting session:', error)
    return NextResponse.json({ user: null, session: null })
  }
}
