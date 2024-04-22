import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VisionService } from './vision.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateImageCategoryDto } from './dto/certificateImageCategory.dto';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { GetUser } from 'src/user/dto/getUser.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('vision') // 이 경로로 요청이 오면 이 컨트롤러가 처리하도록 설정
export class VisionController {
  constructor(private readonly visionService: VisionService) {} // VisionService를 주입

  // 로컬 이미지 파일의 라벨을 감지하고, 주어진 카테고리와 일치하는지 검증하는 엔드포인트
  @Post('/certificate-category')
  @UseGuards(JwtAuthGuard) // JWT AuthGuard를 활용하여 인증 적용
  @UseInterceptors(FileInterceptor('file'))
  async certificateImageCategory(
    @GetUser() user: User, // 사용자 인증 정보를 요청 객체에서 직접 추출
    @UploadedFile() file: Express.Multer.File,
    @Body() certificateImageCategoryDto: CertificateImageCategoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('file must be provided');
    }
    const { missionId, category } = certificateImageCategoryDto;

    // 사용자 ID를 추출하려면 JWT 페이로드에서 가져오거나, 아래 예제와 같이 요청 객체에서 직접 추출할 수 있습니다.
    const userId = user.user_id; // GetUser 데코레이터를 사용하여 사용자 ID를 직접 추출

    const isCategoryMatched = await this.visionService.certificateImageCategory(
      file.buffer, // multer로 받은 파일의 buffer를 사용합니다.
      category,
      +missionId,
      +userId,
    );

    return { isCategoryMatched };
  }
}
