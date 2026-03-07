import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const APP_NAME = 'Smart Study Planner';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Check if SMTP is configured
function isSmtpConfigured(): boolean {
  return !!(SMTP_USER && SMTP_PASS);
}

// Create transporter
function createTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email using Gmail SMTP
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  // If SMTP is not configured, log the email for development
  if (!isSmtpConfigured()) {
    console.log('📧 Email Service (Development Mode - SMTP not configured)');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html.substring(0, 500) + '...');
    console.log('\n💡 To enable email sending, configure SMTP_USER and SMTP_PASS in .env');
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email Service (No Transporter - Development Mode)');
      console.log('To:', to);
      console.log('Subject:', subject);
      return { success: true };
    }

    // Verify connection
    await transporter.verify();
    console.log('📧 SMTP connection verified');

    // Send email
    const info = await transporter.sendMail({
      from: `"${APP_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

// Generate verification email HTML
export function generateVerificationEmailHtml(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px;">Verify Your Email Address</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
            Hi ${name},<br><br>
            Welcome to ${APP_NAME}! Please verify your email address to get started with your learning journey.
          </p>
          
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; line-height: 1.6;">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
          </p>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate password reset email HTML
export function generatePasswordResetEmailHtml(name: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px;">Reset Your Password</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
            Hi ${name},<br><br>
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; line-height: 1.6;">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send verification email
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<{ success: boolean; error?: string }> {
  const verificationUrl = `${APP_URL}/?verify_token=${token}`;
  
  return sendEmail({
    to: email,
    subject: `Verify Your Email - ${APP_NAME}`,
    html: generateVerificationEmailHtml(name, verificationUrl),
  });
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${APP_URL}/?reset_token=${token}`;
  
  return sendEmail({
    to: email,
    subject: `Reset Your Password - ${APP_NAME}`,
    html: generatePasswordResetEmailHtml(name, resetUrl),
  });
}

// Test email connection
export async function testEmailConnection(): Promise<{ success: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    return { 
      success: false, 
      error: 'SMTP not configured. Set SMTP_USER and SMTP_PASS environment variables.' 
    };
  }

  try {
    const transporter = createTransporter();
    if (!transporter) {
      return { success: false, error: 'Failed to create email transporter' };
    }

    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect to SMTP server' 
    };
  }
}
