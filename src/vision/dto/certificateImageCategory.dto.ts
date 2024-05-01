import { Category } from '../../mission/types/category';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CertificateImageCategoryDto {
  @IsNotEmpty()
  @IsString()
  missionId: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}
