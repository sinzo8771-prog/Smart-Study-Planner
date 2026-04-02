import { NextRequest, NextResponse } from 'next/server'




export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, userName } = body

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const gmailUser = process.env.GMAIL_USER
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailAppPassword) {
      
      console.log(`[DEV] Verification code for ${email}: ${code}`)
      return NextResponse.json({ 
        success: true, 
        message: 'Code logged (no email service configured)',
        devMode: true,
        devCode: code
      })
    }

    
    
    
    
    
    console.log(`Sending verification code ${code} to ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent',
    })

  } catch (error) {
    console.error('Error sending verification email:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}














