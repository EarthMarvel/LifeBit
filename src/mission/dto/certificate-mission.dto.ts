import { PickType } from '@nestjs/mapped-types';
import { Mission } from '../entities/mission.entity';

export class CertificateMissionDto extends PickType(Mission, [
  'user_id',
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
