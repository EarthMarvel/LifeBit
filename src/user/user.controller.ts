import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAuthDto } from './dto/emailAuth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';

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
    res.json({ message: '로그인이  완료되었습니다.' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  @UseInterceptors(FileInterceptor('file'))
  async profile(
    @UserInfo() user: User,
    @Body() profileDto: ProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.userService.profile(user.user_id, profileDto, file);
    return { message: '프로필 작성이 완료되었습니다.' };
  }
}
