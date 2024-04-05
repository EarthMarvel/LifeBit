import { MissionType } from '../types/missionType';

export class UpdateMissionDto {
  userId?: number;
  chatroomId?: number;
  category?: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  numberPeople?: number;
  thumbnailUrl?: string;
  type?: MissionType;
  authSum?: number;
}
