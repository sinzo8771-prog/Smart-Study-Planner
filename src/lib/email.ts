import nodemailer from 'nodemailer';


const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const APP_NAME = 'Smart Study Planner';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';


function isSmtpConfigured(): boolean {
  return !!(SMTP_USER && SMTP_PASS);
}


function createTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, 
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


export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  
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

    
    await transporter.verify();
    console.log('📧 SMTP connection verified');

    
    const info = await transporter.sendMail({
      from: `"${APP_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), 
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


export function generateVerificationEmailHtml(name: string, verificationCode: string, verificationUrl: string): string {
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
          
          <!-- Verification Code Box -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">Your verification code is:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; font-family: 'Courier New', monospace;">
              ${verificationCode}
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0;">This code will expire in 24 hours</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px; line-height: 1.6; text-align: center;">
            Or click the button below to verify automatically:
          </p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            If you didn't create an account, you can safely ignore this email.
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


export function generatePasswordResetEmailHtml(name: string, resetCode: string, resetUrl: string): string {
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
            We received a request to reset your password. Use the code below to create a new password.
          </p>
          
          <!-- Reset Code Box -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">Your reset code is:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: 'Courier New', monospace;">
              ${resetCode}
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0;">This code will expire in 1 hour</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px; line-height: 1.6; text-align: center;">
            Or click the button below to reset automatically:
          </p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            If you didn't request a password reset, you can safely ignore this email.
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


export async function sendVerificationEmail(email: string, name: string, code: string, token: string): Promise<{ success: boolean; error?: string }> {
  const verificationUrl = `${APP_URL}/?verify_token=${token}`;
  
  return sendEmail({
    to: email,
    subject: `Your Verification Code - ${APP_NAME}`,
    html: generateVerificationEmailHtml(name, code, verificationUrl),
  });
}


export async function sendPasswordResetEmail(email: string, name: string, code: string, token: string): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${APP_URL}/?reset_token=${token}`;
  
  return sendEmail({
    to: email,
    subject: `Your Password Reset Code - ${APP_NAME}`,
    html: generatePasswordResetEmailHtml(name, code, resetUrl),
  });
}


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
