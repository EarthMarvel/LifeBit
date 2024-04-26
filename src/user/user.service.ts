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
import { EntityManager, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailAuthDto } from './dto/emailAuth.dto';
import { S3Service } from './s3.service';
import { ProfileDto } from './dto/profile.dto';
import { extname } from 'path';
import { WithdrawDto } from './dto/withdraw.dto';
import { Point } from 'src/point/entity/point.entity';
import { PointService } from 'src/point/point.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly s3Service: S3Service,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    private pointService: PointService,
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
    const newUser = await this.userRepository.save({
      email,
      password: hashPassword,
      name,
    });

    const newPoint = await this.pointService.createInitialPoint();
    await this.pointRepository.save(newPoint);
    newUser.point = newPoint;

    // 사용자를 데이터베이스에 저장합니다.
    await this.userRepository.save(newUser);
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log('login : email : ' + email);
    console.log('login : password : ' + password);
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

    const payload = { user_id: user.user_id, email: user.email };
    const refreshToken = this.jwtService.sign(
      { user_id: user.user_id, email: user.email },
      { expiresIn: '7d' },
    );

    await this.cacheManager.set(email, refreshToken, { ttl: 604800000 });

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '12h' }),
      refreshToken,
    };
  }

  // 로그아웃
  async logout(email: string) {
    await this.cacheManager.del(email);
  }

  // 프로필 작성
  async profile(
    user_id: number,
    profileDto: ProfileDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { user_id } });

    const { nickName, description } = profileDto;

    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

      const fileExt = extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        throw new BadRequestException('올바른 JPEG, PNG, GIF 파일이 아닙니다.');
      }

      await this.s3Service.putObject(file);

      if (user.image) {
        await this.s3Service.deleteObject(user.image);
      }
      user.nickName = nickName;
      user.description = description;
      user.image = file.filename;

      await this.userRepository.save(user);
    } else {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }
  }

  // 프로필 조회
  async profileInfo(user_id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.point', 'point')
      .select([
        'user.image',
        'user.name',
        'user.nickName',
        'user.description',
        'point.totalValue',
      ])
      .where('user.user_id = :user_id', { user_id })
      .getOne();

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾지 못했습니다.');
    }
    return user;
  }

  // 회원 탈퇴
  async withdraw(user_id: number, withdrawDto: WithdrawDto) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      select: ['password', 'image'],
    });

    const { password } = withdrawDto;

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }
    await this.s3Service.deleteObject(user.image);
    await this.userRepository.delete({ user_id });
  }

  // 이메일로 회원 정보 가져오기
  async findByEmail(email: string) {
    console.log('findByEmail : email : ' + email);
    return await this.userRepository.findOne({ where: { email } });
  }

  // 인증 코드 숫자 생성 함수
  generateRandomNum(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async findByEmailOrSave(
    email: string,
    fullName: string,
    providerId: string,
  ): Promise<User> {
    const user = await this.findByEmail(email);
    if (user) return user;

    const newUser = await this.userRepository.save({
      email,
      name: fullName,
      providerId,
    });
    return newUser;
  }

  async findOneuser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    return user;
  }
}
