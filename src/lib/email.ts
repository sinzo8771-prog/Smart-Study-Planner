import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const APP_NAME = 'Smart Study Planner';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Send email using Resend
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  // If no API key is configured, log the email for development
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email Service (Development Mode)');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Generate verification email HTML with code
export function generateVerificationCodeEmailHtml(name: string, code: string): string {
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
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px;">Verify Your Email Address</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
            Hi ${name},<br><br>
            Welcome to ${APP_NAME}! Please use the following verification code to complete your registration:
          </p>
          
          <!-- Verification Code Box -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">Your verification code is:</p>
            <div style="font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px; line-height: 1.6;">
            Enter this code in the app to verify your email address.
          </p>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            This code will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
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

// Send verification email with code
export async function sendVerificationEmail(email: string, name: string, code: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: email,
    subject: `Your Verification Code - ${APP_NAME}`,
    html: generateVerificationCodeEmailHtml(name, code),
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
