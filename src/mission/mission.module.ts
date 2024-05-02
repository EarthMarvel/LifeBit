import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { VisionModule } from 'src/vision/vision.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/utils/multer.options.factory';
import { S3Service } from 'src/user/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mission,
      CertificatedImage,
    ]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    VisionModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [MissionService, S3Service],
  controllers: [MissionController],
  exports: [MissionService, S3Service, TypeOrmModule.forFeature([Mission])],
})
export class MissionModule {}
