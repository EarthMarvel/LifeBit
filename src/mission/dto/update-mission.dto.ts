import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../types/category';

export class UpdateMissionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string; // Date로 변경하지 않고, string으로 검증 후 컨트롤러에서 처리

  @IsNotEmpty()
  @IsDateString()
  endDate: string; // Date로 변경하지 않고, string으로 검증 후 컨트롤러에서 처리

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  numberPeople: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
