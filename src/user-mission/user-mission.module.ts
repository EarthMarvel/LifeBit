import { Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { UserMissionController } from './user-mission.controller';

@Module({
  controllers: [UserMissionController],
  providers: [UserMissionService],
})
export class UserMissionModule {}
