import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/utils/multer.options.factory';
import { S3Service } from './s3.service';
import { Repository } from 'typeorm';
import { PointService } from 'src/point/point.service';
import { VisionService } from 'src/vision/vision.service';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { Point } from 'src/point/entity/point.entity';
import { MissionService } from 'src/mission/mission.service';
import { Mission } from 'src/mission/entities/mission.entity';
import { PlannerModule } from 'src/planner/planner.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Mission, Point, CertificatedImage]),
    PlannerModule,
  ],
  providers: [UserService, EmailService, S3Service, PointService],
  controllers: [UserController],
  exports: [UserService, S3Service, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
