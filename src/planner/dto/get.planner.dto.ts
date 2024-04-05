import { IsNotEmpty, IsNumber } from 'class-validator';

export class DateDto {
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;
}
