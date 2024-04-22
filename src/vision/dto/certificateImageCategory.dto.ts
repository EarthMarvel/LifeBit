import { Category } from '../../mission/types/category';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CertificateImageCategoryDto {
  @IsNotEmpty()
  @IsString()
  missionId: string;

  @IsNotEmpty()
  @IsEnum(Category, {
    message: 'Category must be a valid enum value',
  })
  category: Category;
}
