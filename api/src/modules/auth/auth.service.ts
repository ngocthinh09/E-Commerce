/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.validateUser({ username, password });
    const { password: _, ...result } = user;
    return result;
  }

  login(userPayload: { id: string; username: string }) {
    const payload = { sub: userPayload.id, username: userPayload.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: userPayload,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
}
