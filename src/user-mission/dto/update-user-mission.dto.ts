import { PartialType } from '@nestjs/swagger';
import { CreateUserMissionDto } from './create-user-mission.dto';

export class UpdateUserMissionDto extends PartialType(CreateUserMissionDto) {}
