import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as any,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const username = payload.username;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Token is unvalid or user is not exist!');
    }
    return { id: payload.sub, username: payload.username };
  }
}
