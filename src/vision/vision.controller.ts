import { Get, Query } from '@nestjs/common';
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { VisionService } from './vision.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vision') // 이 경로로 요청이 오면 이 컨트롤러가 처리하도록 설정
export class VisionController {
  constructor(private readonly visionService: VisionService) {} // VisionService를 주입

  // 로컬 이미지 파일의 라벨을 감지하는 엔드포인트
  @Get('/detect-labels')
  async detectLabels(@Query('fileName') fileName: string) {
    if (!fileName) {
      throw new BadRequestException('fileName must be provided');
    }
    try {
      const labels = await this.visionService.detectLabels(fileName);
      console.log(fileName);
      return { labels };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('detect-labels-gcs')
  async detectLabelsGCS(
    @Query('bucketName') bucketName: string,
    @Query('fileName') fileName: string,
  ): Promise<string[]> {
    if (!bucketName || !fileName) {
      // BadRequestException을 사용하여 오류 처리
      throw new BadRequestException(
        'bucketName과 fileName 쿼리 파라미터가 필요합니다.',
      );
    }
    return await this.visionService.detectLabelsGCS(bucketName, fileName);
  }

  // 로컬 이미지 파일의 라벨을 감지하고, 주어진 카테고리와 일치하는지 검증하는 엔드포인트
  @Get('/verify-category')
  async verifyCategory(
    @Query('fileName') fileName: string,
    @Query('category') category: string,
  ) {
    if (!fileName || !category) {
      throw new BadRequestException(
        'fileName과 category 모두 제공되어야 합니다.',
      );
    }
    try {
      const isCategoryMatched = await this.visionService.verifyImageCategory(
        fileName,
        category,
      );
      return { isCategoryMatched };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
