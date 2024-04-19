import { IsNotEmpty, IsString } from 'class-validator';

export class PlannerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
