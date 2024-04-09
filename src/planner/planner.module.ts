import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Planner } from './entity/planner.entity';
import { PlannerService } from './planner.service';
import { Mission } from 'src/mission/entities/mission.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Planner, Task, Mission])],
  providers: [PlannerService],
  controllers: [PlannerController],
})
export class PlannerModule {}
