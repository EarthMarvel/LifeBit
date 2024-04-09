import { OmitType } from '@nestjs/swagger';
import { Task } from '../entity/task.entity';
/**
 * todo, start_date, end_date, start_time, end_time, auth_yn, then_mission_id, if_mission, plannerId, check_yn 필요 o
 * plan_id 와 created_at 과 updated_at 필요 x
 */

export class TaskDto extends OmitType(Task, ['taskId', 'createdAt', 'updatedAt']) {}
