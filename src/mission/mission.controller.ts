import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionType } from './types/missionType';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('mission') // 기본 경로로 설정되어 있음
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  // 미션 등록
  // POST /mission
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail')) // 'thumbnail'은 클라이언트가 보내는 파일 필드의 이름입니다.
  async createMission(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMissionDto: CreateMissionDto,
    @Req() req: any,
  ) {
    const user = req.user; // 인증된 사용자 정보 사용
    console.log('req.user.user_id : ' + req.user.user_id);
    // 파일 정보(file)와 나머지 데이터(createMissionDto)를 서비스에 전달
    return await this.missionService.create(
      createMissionDto,
      req.user.user_id,
      file,
    );
  }

  // 일단 스킵
  // 미션 목록 조회
  // GET /mission
  // @Get()
  // async getMissionList() {}

  // 미션 상세 조회
  // GET /mission/:missionId
  @Get('/:missionId')
  async findMissionById(@Param('missionId') missionId: number) {
    try {
      return await this.missionService.findOne(missionId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // 미션 수정
  // UPDATE /mission/:missionId
  @Put('/:missionId')
  async update(
    @Param('missionId') missionId: number,
    @Body() updateMissionDto: UpdateMissionDto,
    @Req() req: any,
  ) {
    try {
      return await this.missionService.update(
        req.userId,
        +missionId,
        updateMissionDto,
      );
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // 미션 삭제
  // DELETE /mission/:missionId
  @Delete('/:missionId')
  async delete(@Param('missionId') missionId: number, @Req() req: any) {
    try {
      const userId = req.user_id;

      return await this.missionService.remove(+missionId, userId);
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
