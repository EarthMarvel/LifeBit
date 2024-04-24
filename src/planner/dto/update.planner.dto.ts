import { IsNotEmpty, IsString } from 'class-validator';

export class PlannerDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
