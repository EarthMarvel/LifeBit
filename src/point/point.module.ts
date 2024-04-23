import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entity/point.entity';
import { User } from 'src/user/entities/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Point } from './entity/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point, User])],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService], // PointService를 다른 모듈에서 사용할 수 있게 export합니다.
})
export class PointModule {}
