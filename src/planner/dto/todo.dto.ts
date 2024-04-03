import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { Plan } from '../entity/plan.entity';

/**
 * todo, start_date, end_date, start_time, end_time, auth_yn, then_mission_id, if_mission, plannerId, check_yn 필요 o
 * plan_id 와 created_at 과 updated_at 필요 x
 */

export class TodoDto extends OmitType(Plan, [
  'planId',
  'createdAt',
  'updatedAt',
]) {}
