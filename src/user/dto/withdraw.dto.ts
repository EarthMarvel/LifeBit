import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class WithdrawDto extends PickType(RegisterDto, ['password'] as const) {}
