import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CookieOptions, type Response } from 'express';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtRefreshAuthGuard } from '../../guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };
  }

  private setCookies(
    res: Response,
    access_token: string,
    refresh_token: string,
  ) {
    const options = this.cookieOptions;
    res.cookie('access_token', access_token, {
      ...options,
      maxAge: +this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    });
    res.cookie('refresh_token', refresh_token, {
      ...options,
      maxAge: +this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(signInDto);
    this.setCookies(res, access_token, refresh_token);
    return { user };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Request() request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token, user } =
      this.authService.refreshTokens(request.user);
    res.cookie('access_token', access_token, {
      ...this.cookieOptions,
      maxAge: +this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    });
    res.cookie('refresh_token', refresh_token, {
      ...this.cookieOptions,
      maxAge: +this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    });
    return { user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);
    return { message: 'Successfully signed out.' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getProfile(@Request() request) {
    return this.authService.getProfile(request.user.id);
  }

  @Get('verify-email')
  async verifyEmail(@Request() request, @Res() res) {
    const { userId, token } = request.query;
    const verifiedUser = await this.userService.updateVerificationStatus(
      userId,
      token,
    );
    const payload = {
      id: verifiedUser.id,
      email: verifiedUser.email,
    };
    const { access_token, refresh_token } =
      this.authService.generateTokens(payload);
    res.cookie('access_token', access_token, {
      ...this.cookieOptions,
      maxAge: +this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    });
    res.cookie('refresh_token', refresh_token, {
      ...this.cookieOptions,
      maxAge: +this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.redirect(
      `${this.configService.getOrThrow('FRONTEND_URL')}/?verified=true`,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Request() request) {
    const { email } = request.body;
    await this.authService.sendResetPasswordEmail(email);
    return { message: 'Password reset email sent.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password/:userId/:token')
  async resetPassword(@Request() request) {
    const { userId, token } = request.params;
    const { newPassword } = request.body;
    return this.authService.resetPassword(userId, token, newPassword);
  }
}
