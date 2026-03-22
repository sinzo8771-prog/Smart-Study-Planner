import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    const { email } = body

    console.log('📧 Resend verification request:', { email })

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find user
    const user = await db.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      console.log('❌ User not found:', normalizedEmail)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate new code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log('📧 Generated new verification code for:', normalizedEmail)

    // Delete existing unused codes
    try {
      await db.emailVerificationCode.deleteMany({
        where: { email: normalizedEmail, used: false }
      })
      console.log('✅ Deleted old unused codes')
    } catch (e) {
      console.log('⚠️ Could not delete old codes:', e)
    }

    // Save new code
    await db.emailVerificationCode.create({
      data: { email: normalizedEmail, code, expiresAt }
    })
    console.log('✅ New verification code saved')

    // Send email
    let emailResult = { success: false, devMode: true, devCode: code }
    try {
      emailResult = await sendVerificationEmail(normalizedEmail, code, user.name)
      console.log('📧 Email sent:', { success: emailResult.success, devMode: emailResult.devMode })
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'New verification code sent!',
      devCode: emailResult.devMode || emailResult.devCode ? code : undefined
    })

  } catch (error) {
    console.error('❌ Error in send-verification:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ 
      error: 'Failed to send code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
