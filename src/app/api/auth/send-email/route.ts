import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'






















function getEmailTransporter() {
  
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

  
  const outlookUser = process.env.OUTLOOK_USER
  const outlookPassword = process.env.OUTLOOK_APP_PASSWORD

  
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  if (gmailUser && gmailAppPassword) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailAppPassword }
      }),
      fromEmail: gmailUser,
      provider: 'Gmail'
    }
  }

  if (outlookUser && outlookPassword) {
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: { user: outlookUser, pass: outlookPassword }
      }),
      fromEmail: outlookUser,
      provider: 'Outlook'
    }
  }

  if (smtpHost && smtpUser && smtpPassword) {
    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: smtpPort === '465',
        auth: { user: smtpUser, pass: smtpPassword }
      }),
      fromEmail: smtpUser,
      provider: 'Custom SMTP'
    }
  }

  return null
}

export async function sendVerificationEmail(email: string, code: string, userName: string) {
  const emailConfig = getEmailTransporter()

  
  if (!emailConfig) {
    console.log(`\n🔐 ==========================================`)
    console.log(`📧 VERIFICATION CODE (DEV MODE)`)
    console.log(`   Email: ${email}`)
    console.log(`   Code:  ${code}`)
    console.log(`==========================================\n`)
    return { success: true, devMode: true, devCode: code }
  }

  const { transporter, fromEmail, provider } = emailConfig

  try {
    const info = await transporter.sendMail({
      from: `"Smart Study Planner" <${fromEmail}>`,
      to: email,
      subject: '📚 Your Verification Code - Smart Study Planner',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 28px;">📚 Smart Study Planner</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Verify your email address</p>
            </div>
            <div style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px;">Hello <strong>${userName || 'there'}</strong>,</p>
              <p style="color: #374151; font-size: 16px; margin: 20px 0;">Your verification code is:</p>
              <div style="background: linear-gradient(135deg, #EFF6FF, #F5F3FF); border: 2px solid #3B82F6; border-radius: 12px; padding: 30px; text-align: center;">
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase;">Your Code</p>
                <p style="font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #3B82F6; margin: 0; font-family: 'Courier New', monospace;">${code}</p>
              </div>
              <p style="color: #6B7280; font-size: 14px; margin: 20px 0;">⏰ Expires in 10 minutes. If you didn't request this, ignore this email.</p>
            </div>
            <div style="background: #F9FAFB; padding: 20px; text-align: center;">
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Smart Study Planner</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    console.log(`✅ Email sent via ${provider} to ${email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error(`❌ Email failed:`, error)
    return { success: false, error: String(error) }
  }
}


export async function POST(request: NextRequest) {
  try {
    const { email, code, userName } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code required' }, { status: 400 })
    }

    const result = await sendVerificationEmail(email, code, userName)
    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
