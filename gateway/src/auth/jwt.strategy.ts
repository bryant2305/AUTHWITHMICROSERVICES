// jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/services/user-service/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.userService
      .findOneUserByEmail(payload.email)
      .toPromise();
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
