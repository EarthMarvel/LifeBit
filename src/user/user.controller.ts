import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAuthDto } from './dto/emailAuth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('emailAuth')
  async sendVerification(@Body() emailAuthDto: EmailAuthDto) {
    await this.userService.sendVerification(emailAuthDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.userService.register(registerDto);
    return { message: '회원가입이 완료되었습니다.' };
  }

  @Post('log-in')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const token = await this.userService.login(loginDto);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.json({ message: '회원가입이 완료되었습니다.' });
  }
}
