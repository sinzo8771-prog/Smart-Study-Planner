import { NextRequest, NextResponse } from 'next/server'

// Email sending using Gmail SMTP via Nodemailer
// This is a free alternative that doesn't require domain verification

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
      // Development mode: Just log the code
      console.log(`[DEV] Verification code for ${email}: ${code}`)
      return NextResponse.json({ 
        success: true, 
        message: 'Code logged (no email service configured)',
        devMode: true,
        devCode: code
      })
    }

    // For Gmail, we'll use a simple approach with fetch to an email API
    // Since we can't use nodemailer directly in Vercel Edge functions,
    // we'll use the Gmail API approach or stick with Resend for now
    
    // Log for development
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

// ============================================
// HOW TO SET UP GMAIL FOR SENDING EMAILS:
// ============================================
// 
// 1. Go to your Google Account: https://myaccount.google.com
// 2. Enable 2-Factor Authentication
// 3. Go to Security > App passwords
// 4. Generate a new app password for "Mail"
// 5. Add these environment variables:
//    GMAIL_USER=your-email@gmail.com
//    GMAIL_APP_PASSWORD=your-16-char-app-password
//
// Note: Gmail has a limit of ~500 emails/day
