import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: parseInt(this.configService.getOrThrow<string>('SMTP_PORT'), 10),
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(
    toEmail: string,
    userId: string,
    token: string,
  ): Promise<void> {
    const verificationLink = `${this.configService.getOrThrow<string>('BACKEND_URL')}/api/auth/verify-email?userId=${userId}&token=${token}`;
    const mailOptions = {
      from: '"E-Commerce" <no-reply@realtimequiz.com>',
      to: toEmail,
      subject: 'Verify Your Email',
      html: `<p>Please click the following link to verify your email:</p><a href="${verificationLink}">Click here to verify your email</a>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', toEmail);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(
    toEmail: string,
    userId: string,
    token: string,
  ): Promise<void> {
    const resetLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/forgot-password/new-password/${userId}?token=${token}`;
    const mailOptions = {
      from: '"E-Commerce" <no-reply@realtimequiz.com>',
      to: toEmail,
      subject: 'Reset Your Password',
      html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">Click here to proceed to reset password</a>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent to:', toEmail);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}
