import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
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
    res.cookie('authorization', `Bearer ${token.accessToken}`, {
      maxAge: 43200000,
      httpOnly: true,
    });
    res.cookie('refreshToken', `${token.refreshToken}`, {
      maxAge: 604800000,
      httpOnly: true,
    });
    res.redirect('/main');
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Req() req: Request) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req: SocialRequest, @Res() res) {
    const token = await this.authService.socialLogin(req);
    res.cookie('authorization', `Bearer ${token.accessToken}`, {
      maxAge: 43200000,
      httpOnly: true,
    });
    res.cookie('refreshToken', `${token.refreshToken}`, {
      maxAge: 604800000,
      httpOnly: true,
    });
    res.redirect('/main');
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {}

  @Get('google/callback')
  @Render('log-in.ejs')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: SocialRequest, @Res() res) {
    const token = await this.authService.googleLogin(req);
    res.cookie('authorization', `Bearer ${token.accessToken}`, {
      maxAge: 43200000,
      httpOnly: true,
    });
    res.cookie('refreshToken', `${token.refreshToken}`, {
      maxAge: 604800000,
      httpOnly: true,
    });
    res.redirect('/main');
  }
}
