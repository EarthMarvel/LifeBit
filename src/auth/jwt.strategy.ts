import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import _ from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const { authorization } = req.cookies;
    if (authorization) {
      const [tokenType, token] = authorization.split(' ');
      if (token) {
        return token;
      }
    }
    return null;
  }

  async validate(payload: any) {
    console.log('Before : payload : ' + payload);
    const user = await this.userService.findByEmail(payload.email);
    console.log('validate : user : ' + user);
    console.log('validate : JSON.stringify(user) : ' + JSON.stringify(user));
    console.log('validate : payload : ' + payload);
    console.log(
      'validate : JSON.stringify(payload) : ' + JSON.stringify(payload),
    );
    console.log('validate : payload.email : ' + payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    return user;
  }
}
