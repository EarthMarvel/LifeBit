import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../types/category_status.enum';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @IsEnum(Category)
  category: Category;
}
