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

export class UpdateMissionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

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

  // DTO에는 participants 목록을 추가하지 않았습니다.
}
