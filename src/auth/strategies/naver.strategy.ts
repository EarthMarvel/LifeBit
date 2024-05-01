import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'passport-jwt';
import { Strategy, Profile } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLINET_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    try {
      const { id, name, email } = profile;
      const user = {
        provider: 'naver',
        providerId: id,
        name: name,
        email: email,
      };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
}
