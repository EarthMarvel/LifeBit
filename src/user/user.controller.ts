import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Render,
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
import { WithdrawDto } from './dto/withdraw.dto';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { PlannerService } from 'src/planner/planner.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly plannerService: PlannerService,
  ) {}

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
    res.cookie('authorization', `Bearer ${token.accessToken}`, {
      maxAge: 43200000,
      httpOnly: true,
    });
    res.cookie('refreshToken', `${token.refreshToken}`, {
      maxAge: 604800000,
      httpOnly: true,
    });
    res.json({ message: '로그인이 완료되었습니다.' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logout(@UserInfo() user: User, @Res() res: any) {
    await this.userService.logout(user.email);
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.json({ message: '로그아웃되었습니다.' });
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('profileInfo')
  @Render('mypage.ejs')
  async profileInfo(@UserInfo() user: User, @Req() req: Request) {
    const userInfo = await this.userService.profileInfo(user.user_id);
    // const data = await this.plannerService.mission(user.user_id);
    return { userInfo, /*data,*/ isLoggedIn: req['isLoggedIn'] };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('withdraw')
  async withdraw(@UserInfo() user: User, @Body() withdrawDto: WithdrawDto) {
    await this.userService.withdraw(user.user_id, withdrawDto);
    return { message: '회원탈퇴가 되었습니다.' };
  }

  @Get('sign-in')
  @Render('log-in.ejs')
  async getSignIn(@Req() req: Request) {
    return { isLoggedIn: req['isLoggedIn'] };
  }

  @Get('sign-up')
  @Render('register.ejs')
  async getSignUp(@Req() req: Request) {
    return { isLoggedIn: req['isLoggedIn'] };
  }

  @Get('setProfile')
  @Render('profile.ejs')
  async setProfile(@Req() req: Request) {
    return { isLoggedIn: req['isLoggedIn'] };
  }
}
