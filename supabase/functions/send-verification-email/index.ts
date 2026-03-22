import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface EmailRequest {
  email: string;
  code: string;
  userName: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { email, code, userName }: EmailRequest = await req.json()

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Supabase URL and service role key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Send email using Supabase's built-in email service
    const response = await fetch(`${supabaseUrl}/auth/v1/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${Deno.env.get('SITE_URL') || 'https://smart-study-plannerr.vercel.app'}/auth/callback`,
          data: {
            verification_code: code,
            user_name: userName,
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Supabase email error:', error)
      
      // Fallback: Log the code for development
      console.log(`Verification code for ${email}: ${code}`)
      
      // Return success anyway for development
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Code generated (check logs for development)',
          devMode: true 
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully' 
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send verification email' }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
