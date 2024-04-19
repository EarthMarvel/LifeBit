import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SocialRequest } from './dto/auth.social.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(req: SocialRequest) {
    try {
      const {
        user: { email, name, providerId },
      } = req;

      let user = await this.userService.findByEmail(email);
      if (!user) {
        user = await this.userService.findByEmailOrSave(
          email,
          name,
          providerId,
        );
      }

      const socialPayload = { email, user_id: user.user_id };

      return {
        accessToken: this.jwtService.sign(socialPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }

  async googleLogin(req: SocialRequest) {
    try {
      const {
        user: { email, name, providerId },
      } = req;

      const fullName = name['familyName'] + name['givenName'];

      let user = await this.userService.findByEmail(email);
      if (!user) {
        user = await this.userService.findByEmailOrSave(
          email,
          fullName,
          providerId,
        );
      }

      const socialPayload = { email, user_id: user.user_id };

      return {
        accessToken: this.jwtService.sign(socialPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }

  async validateAccessToken(token: string): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.verify(token);
      if (decodedToken) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }
}
