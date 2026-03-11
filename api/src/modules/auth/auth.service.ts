/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  generateTokens(payload: { id: string; email: string }) {
    const jwtPayload = {
      sub: payload.id,
      email: payload.email,
    };

    const accessTokenExpiresInSeconds = Math.floor(
      Number(
        this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
      ) / 1000,
    );
    const refreshTokenExpiresInSeconds = Math.floor(
      Number(
        this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_MS',
        ),
      ) / 1000,
    );

    const access_token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: accessTokenExpiresInSeconds,
    });

    const refresh_token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: refreshTokenExpiresInSeconds,
    });

    return { access_token, refresh_token, user: payload };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const { password, ...result } = user;

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);
    await this.userService.updateVerificationToken(
      user.id,
      verificationToken,
      expiryDate,
    );
    await this.mailService.sendVerificationEmail(
      user.email,
      user.id,
      verificationToken,
    );

    return {
      message:
        'User created successfully. Please check your email to verify your account.',
      user: result,
    };
  }

  async login(signInDto: { email: string; password: string }) {
    const user = await this.userService.validateUser(signInDto);
    const userPayload = {
      id: user.id,
      email: user.email,
    };
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    return this.generateTokens(userPayload);
  }

  refreshTokens(userPayload: { id: string; email: string }) {
    return this.generateTokens(userPayload);
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ConflictException('Email not found!');
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);
    const updatedUser = await this.userService.updateResetPasswordToken(
      user.id,
      resetToken,
      expiryDate,
    );
    await this.mailService.sendPasswordResetEmail(
      updatedUser.email,
      updatedUser.id,
      resetToken,
    );

    return {
      message: 'The url to reset your password sent. Please check your email.',
    };
  }

  async resetPassword(userId: string, token: string, newPassword: string) {
    const user = await this.userService.findById(userId);
    if (
      !user ||
      user.resetPasswordToken !== token ||
      !user.resetPasswordTokenExpiry ||
      user.resetPasswordTokenExpiry < new Date()
    ) {
      throw new ConflictException('Invalid password reset token!');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    await this.userService.updatePassword(userId, newPassword);
    return { message: 'Password reset successfully.' };
  }
}
