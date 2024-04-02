import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class EmailAuthDto extends PickType(RegisterDto, ['email'] as const) {}
