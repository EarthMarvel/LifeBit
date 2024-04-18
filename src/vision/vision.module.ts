import { Module } from '@nestjs/common';
import { VisionService } from './vision.service';
import { VisionController } from './vision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatedImage } from './entity/certificatedImage.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificatedImage, Mission, User])],
  providers: [VisionService],
  controllers: [VisionController],
  exports: [VisionService],
})
export class VisionModule {}
