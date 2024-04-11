import { Controller, Get, Req, Res, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SocialRequest } from './dto/auth.social.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(@Req() req: Request) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req: SocialRequest, @Res() res) {
    const token = await this.authService.socialLogin(req);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.json({ message: '로그인이  완료되었습니다.' });
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Req() req: Request) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req: SocialRequest, @Res() res) {
    const token = await this.authService.socialLogin(req);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.json({ message: '로그인이  완료되었습니다.' });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: SocialRequest, @Res() res) {
    const token = await this.authService.googleLogin(req);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.json({ message: '로그인이  완료되었습니다.' });
  }
}
