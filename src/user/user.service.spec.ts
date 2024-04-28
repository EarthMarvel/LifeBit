import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { S3Service } from './s3.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailAuthDto } from './dto/emailAuth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { ProfileDto } from './dto/profile.dto';
import { Readable } from 'typeorm/platform/PlatformTools';
import { NotFound } from '@aws-sdk/client-s3';
import { WithdrawDto } from './dto/withdraw.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let jwtServiceMock: Partial<JwtService>;
  let emailServiceMock: Partial<EmailService>;
  let cacheManagerMock: Partial<Cache>;
  let s3ServiceMock: Partial<S3Service>;

  beforeEach(async () => {
    userRepositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('test_jwt_token'),
    };

    emailServiceMock = {
      sendVerifyToken: jest.fn(),
    };

    cacheManagerMock = {
      set: jest.fn(),
      get: jest.fn().mockReturnValue('test_cache_value'),
      del: jest.fn(),
    };

    s3ServiceMock = {
      putObject: jest.fn(),
      deleteObject: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: S3Service,
          useValue: s3ServiceMock,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  describe('sendVerification', () => {
    it('should set verification token in cache and send verification email', async () => {
      const emailAuthDto: EmailAuthDto = { email: 'test@example.com' };
      const expectedToken = 123456;

      jest
        .spyOn(userService, 'generateRandomNum')
        .mockReturnValue(expectedToken);

      await userService.sendVerification(emailAuthDto);

      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        emailAuthDto.email,
        expectedToken,
        { ttl: 180000 },
      );
      expect(emailServiceMock.sendVerifyToken).toHaveBeenCalledWith(
        emailAuthDto.email,
        expectedToken,
      );
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        verifyToken: 123456,
        chekPassword: 'password',
        name: 'Test User',
      };
      const existingUser = null;
      const cache_verifyToken = 123456;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser);
      jest.spyOn(cacheManagerMock, 'get').mockResolvedValue(cache_verifyToken);

      await userService.register(registerDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(registerDto.email);
      expect(cacheManagerMock.del).toHaveBeenCalledWith(registerDto.email);
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        email: registerDto.email,
        password: expect.any(String),
        name: registerDto.name,
      });
    });
  });

  describe('login', () => {
    it('should return access token when valid email and password are provided', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await hash('password', 12);
      const user = {
        user_id: 1,
        email: loginDto.email,
        password: hashedPassword,
      };

      userRepositoryMock.findOne.mockResolvedValue(user);

      const result = await userService.login(loginDto);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: ['user_id', 'email', 'password'],
      });
      expect(result.accessToken).toEqual('test_jwt_token');
    });
    it('should throw NotFoundException when email does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw UnauthorizedException when incorrect password is provided', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        user_id: 1,
        email: loginDto.email,
        password: 'hashed_password',
      };

      userRepositoryMock.findOne.mockResolvedValue(user);

      await expect(userService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('profile', () => {
    it('should upload new image when user does not have an existing image', async () => {
      const user_id = 1;
      const profileDto: ProfileDto = {
        nickName: 'TestUser',
        description: 'hahah',
      };
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

      userRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue({ user_id, image: null });

      await userService.profile(user_id, profileDto, file);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user_id },
      });
      expect(s3ServiceMock.putObject).toHaveBeenCalledWith(file);
      expect(s3ServiceMock.deleteObject).not.toHaveBeenCalled();
    });
    it('should update user profile and save file to S3 when valid file is provided', async () => {
      const user_id = 1;
      const user = { user_id, image: 'old_image.jpg', nickName: 'TestUSer' };
      const profileDto: ProfileDto = {
        nickName: 'TestUser',
        description: 'hahah',
      };
      const file: Express.Multer.File = {
        fieldname: 'test_field',
        originalname: 'test_file.jpg',
        encoding: 'utf-8',
        mimetype: 'image/jpeg',
        size: 1024,
        filename: 'test_file.jpg',
        stream: Readable.from(Buffer.from('dummy_image_date')),
        destination: '',
        path: '',
        buffer: Buffer.from('dummy_image_date'),
      };
      userRepositoryMock.findOne.mockResolvedValue(user);

      await userService.profile(user_id, profileDto, file);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user_id },
      });
      expect(s3ServiceMock.deleteObject).toHaveBeenCalledWith('old_image.jpg');
      expect(s3ServiceMock.putObject).toHaveBeenCalledWith(file);
      expect(user.image).toEqual(file.filename);
      expect(user.nickName).toEqual(profileDto.nickName);
    });
    it('should throw BadRequestException when no file is provided', async () => {
      const user_id = 1;
      const profileDto: ProfileDto = {
        nickName: 'TestUser',
        description: 'hahah',
      };

      await expect(
        userService.profile(user_id, profileDto, null),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException when an invalid file extension is provided', async () => {
      const user_id = 1;
      const profileDto: ProfileDto = {
        nickName: 'TestUser',
        description: 'hahah',
      };
      const file: Express.Multer.File = {
        fieldname: 'test_field',
        originalname: 'test_file.txt',
        encoding: 'utf-8',
        mimetype: 'image/jpeg',
        size: 1024,
        filename: 'test_file.txt',
        stream: null,
        destination: '',
        path: '',
        buffer: Buffer.from('dummy_image_date'),
      };

      userRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue({ user_id, image: 'old_image.jpg' });

      await expect(
        userService.profile(user_id, profileDto, file),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('profileInfo', () => {
    it('should return user profile info when user exists', async () => {
      const user_id = 1;
      const mockProfileInfo = { image: 'test_image.jpg', nickName: 'TestUser' };

      userRepositoryMock.findOne = jest.fn().mockResolvedValue(mockProfileInfo);

      const result = await userService.profileInfo(user_id);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user_id },
        select: ['image', 'nickName'],
      });
      expect(result).toEqual(mockProfileInfo);
    });
  });
  describe('withdraw', () => {
    it('should withdraw user when password is correct', async () => {
      const user_id = 1;
      const password = 'password';
      const image = 'profile_image.jpg';
      const withdrawDto: WithdrawDto = { password };

      const user = {
        user_id,
        password: await hash(password, 12),
        image,
      };

      userRepositoryMock.findOne.mockResolvedValue(user);

      await userService.withdraw(user_id, withdrawDto);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user_id },
        select: ['password', 'image'],
      });
      expect(s3ServiceMock.deleteObject).toHaveBeenCalledWith(image);
      expect(userRepositoryMock.delete).toHaveBeenCalledWith({ user_id });
    });
    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user_id = 1;
      const password = 'password';
      const withdrawDto: WithdrawDto = { password };

      const user = {
        user_id,
        password: 'nopassword',
        image: 'profile_image.jpg',
      };

      userRepositoryMock.findOne.mockResolvedValue(user);

      await expect(userService.withdraw(user_id, withdrawDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user_id },
        select: ['password', 'image'],
      });
      expect(s3ServiceMock.deleteObject).not.toHaveBeenCalled();
      expect(userRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
