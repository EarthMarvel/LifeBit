import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePointDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
