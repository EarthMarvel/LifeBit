import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { VisionModule } from 'src/vision/vision.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, CertificatedImage]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    VisionModule,
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
