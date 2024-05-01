import { OmitType } from '@nestjs/swagger';
import { Task } from '../entity/task.entity';

export class TaskDto extends OmitType(Task, ['taskId', 'createdAt', 'updatedAt']) {}
