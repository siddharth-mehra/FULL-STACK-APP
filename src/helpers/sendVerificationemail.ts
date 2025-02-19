import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  name: string,
  verifyCode: string // Added the 'verifyCode' parameter
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const otp = verifyCode;
    console.log(name,otp);
    // Directly generate the HTML content with dynamic values
    const emailBody = `
      <html lang="en">
        <head>
          <title>Verification Code</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
            }
            h2 {
              color: #2c3e50;
            }
            p {
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h2>Hello ${name},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <h3>${otp}</h3>
          <p>If you did not request this code, please ignore this email.</p>
        </body>
      </html>
    `;

    // Email content
    const mailOptions = {
      from: process.env.MAIL_USER || undefined, // Sender email
      to: email, // Recipient email
      subject: 'My Verification | Verify Email', // Subject of the email
      html: emailBody, // Directly generated HTML content
    };

    // Send email using Nodemailer
    const response = await transporter.sendMail(mailOptions);

    console.log('Email send response', response);
    return { success: true, message: 'Verification email sent' };
  } catch (emailError) {
    console.error('Error sending verification email', emailError);
    return { success: false, message: 'Error sending verification email' };
  }
}

