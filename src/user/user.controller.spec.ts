import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailAuthDto } from './dto/emailAuth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ProfileDto } from './dto/profile.dto';
import { User } from './entities/user.entity';
import { WithdrawDto } from './dto/withdraw.dto';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            sendVerification: jest.fn(),
            register: jest.fn(),
            login: jest.fn().mockResolvedValue('mockAccessToken'),
            profile: jest.fn(),
            profileInfo: jest.fn(),
            withdraw: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userServiceMock = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send verification email', async () => {
    const emailAuthDto: EmailAuthDto = { email: 'test@example.com' };
    await controller.sendVerification(emailAuthDto);
    expect(userServiceMock.sendVerification).toHaveBeenCalledWith(emailAuthDto);
  });

  it('should register user', async () => {
    const registerDto: RegisterDto = {
      name: 'testuser',
      email: 'test@example.com',
      verifyToken: 123456,
      password: 'password',
      chekPassword: 'password',
    };
    await controller.register(registerDto);
    expect(userServiceMock.register).toHaveBeenCalledWith(registerDto);
  });

  it('should login user and set authorization cookie', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const res = {
      cookie: jest.fn(),
      json: jest.fn(),
    };
    const token = await controller.login(loginDto, res);
    expect(userServiceMock.login).toHaveBeenCalledWith(loginDto);
    expect(res.cookie).toHaveBeenCalledWith('authorization', `Bearer ${token}`);
    expect(res.json).toHaveBeenCalledWith({
      message: '로그인이 완료되었습니다.',
    });
  });

  it('should update user profile', async () => {
    const user: User = {
      user_id: 1,
      email: 'test@example.com',
      name: 'TestUser',
      nickName: 'Test User',
      password: 'password',
      image: null,
      providerId: null,
      likeBoards: null,
      point: null,
      missions: null,
    };
    const profileDto: ProfileDto = { nickName: 'TestUser' };
    const file: Express.Multer.File = {
      fieldname: 'test_field',
      originalname: 'test_file.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024,
      filename: 'test_file.jpg',
      stream: null,
      destination: '',
      path: '',
      buffer: Buffer.from('dummy_image_date'),
    };

    const Message = '프로필 작성이 완료되었습니다.';

    jest.spyOn(userServiceMock, 'profile').mockResolvedValueOnce(undefined);

    const result = await controller.profile(user, profileDto, file);

    expect(userServiceMock.profile).toHaveBeenCalledWith(
      user.user_id,
      profileDto,
      file,
    );
    expect(result).toEqual({ message: Message });
  });

  it('should get profile information', async () => {
    const user: User = {
      user_id: 1,
      email: 'test@example.com',
      name: 'TestUser',
      nickName: 'Test User',
      password: 'password',
      image: null,
      providerId: null,
      likeBoards: null,
      point: null,
      missions: null,
    };
    const profileInfoMock = {
      user_id: 1,
      email: 'test@example.com',
      name: 'TestUser',
      nickName: 'Test User',
      password: 'password',
      image: null,
      providerId: null,
      likeBoards: null,
      point: null,
      missions: null,
    };

    jest
      .spyOn(userServiceMock, 'profileInfo')
      .mockResolvedValueOnce(profileInfoMock);

    const result = await controller.profileInfo(user);

    expect(userServiceMock.profileInfo).toHaveBeenCalledWith(user.user_id);
    expect(result).toEqual(profileInfoMock);
  });

  it('should withdraw user', async () => {
    const user: User = {
      user_id: 1,
      email: 'test@example.com',
      name: 'TestUser',
      nickName: 'Test User',
      password: 'password',
      image: null,
      providerId: null,
      likeBoards: null,
      point: null,
      missions: null,
    };
    const withdrawDto: WithdrawDto = { password: 'password' };

    await controller.withdraw(user, withdrawDto);

    expect(userServiceMock.withdraw).toHaveBeenCalledWith(
      user.user_id,
      withdrawDto,
    );
  });
});
