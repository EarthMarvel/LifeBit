import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Point } from './entity/point.entity';

@Module({
  providers: [PointService],
  controllers: [PointController],
})
export class PointModule {}
