import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/planner/entity/task.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Task])],
  providers: [SchedulerService],
})
export class SchedulerModule {}
