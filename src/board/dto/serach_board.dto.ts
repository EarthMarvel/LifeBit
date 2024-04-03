// search-board.dto.ts

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '../types/category_status.enum';

export class SearchBoardDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(Category)
  category: Category;
}
