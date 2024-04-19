import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '../types/category_status.enum';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(Category)
  category: Category;
}
