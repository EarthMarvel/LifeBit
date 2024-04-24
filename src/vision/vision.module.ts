import { Module } from '@nestjs/common';
import { VisionService } from './vision.service';
import { VisionController } from './vision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatedImage } from './entity/certificatedImage.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { PointModule } from 'src/point/point.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Point } from 'src/point/entity/point.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificatedImage, Mission, User, Point]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    PointModule,
  ], // PointModule을 imports 배열에 추가합니다.
  providers: [VisionService],
  controllers: [VisionController],
  exports: [VisionService],
})
export class VisionModule {}
