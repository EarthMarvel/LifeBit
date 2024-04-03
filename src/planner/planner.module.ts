import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { Planner } from './entity/planner.entity';
import { Point } from 'src/point/entity/point.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Planner, Plan, Point])],
  providers: [PlannerService],
  controllers: [PlannerController]
})
export class PlannerModule {}
