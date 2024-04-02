import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailAuthDto } from './dto/emailAuth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 이메일, 토큰 캐싱 부분
  async sendVerification(emailAuthDto: EmailAuthDto) {
    const { email } = emailAuthDto;
    const verifyToken = this.generateRandomNum();
    await this.cacheManager.set(email, verifyToken, { ttl: 180000 });
    await this.sendVerifyToken(email, verifyToken);
  }

  // 이메일 인증 코드 발송
  async sendVerifyToken(email: string, verifyToken: number) {
    await this.emailService.sendVerifyToken(email, verifyToken);
  }

  // 회원가입
  async register(registerDto: RegisterDto) {
    const { email, password, verifyToken, chekPassword, name } = registerDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    }

    const cache_verifyToken = await this.cacheManager.get<number>(email);
    if (_.isNil(cache_verifyToken)) {
      throw new NotFoundException('해당 이메일로 전송된 이메일이 없습니다.');
    } else if (cache_verifyToken !== verifyToken) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.cacheManager.del(email);
    }

    if (password !== chekPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    const hashPassword = await hash(password, 12);
    await this.userRepository.save({
      email,
      password: hashPassword,
      name,
    });
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['user_id', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException('존재하지 않는 이메일입니다.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, user_id: user.user_id };
    console.log('-------->', payload);

    return { accessToken: this.jwtService.sign(payload) };
  }

  // 이메일로 회원 정보 가져오기
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  // 인증 코드 숫자 생성 함수
  private generateRandomNum(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
