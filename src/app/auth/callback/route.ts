import { createSupabaseServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get user info after successful authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Sync user with our database via API
        try {
          await fetch(`${origin}/api/auth/sync-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
              provider: 'google',
            }),
          })
        } catch (syncError) {
          console.error('Error syncing user:', syncError)
        }
      }
      
      // Successful redirect
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('OAuth error:', error.message)
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?auth=login&error=oauth_callback_failed`)
}
