import { PickType } from '@nestjs/mapped-types';
import { Mission } from '../entities/mission.entity';

export class UpdateMissionDto extends PickType(Mission, [
  'creatorId',
  /*'chatroomId',*/
  'category',
  'title',
  'description',
  'startDate',
  'endDate',
  'numberPeople',
  'thumbnailUrl',
  'type',
  'authSum',
]) {}
