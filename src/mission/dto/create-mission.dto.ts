import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Category } from '../types/category';
import { User } from '../../user/entities/user.entity';

export class CreateMissionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  numberPeople: number;

  @IsNotEmpty()
  @IsString()
  description: string;

}
