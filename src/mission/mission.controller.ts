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
} from '@nestjs/common';

import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionType } from './types/missionType';

@Controller('mission') // 기본 경로로 설정되어 있음
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  // 미션 등록
  // POST /mission
  @Post()
  async createMission(
    @Body() createMissionDto: CreateMissionDto,
    @Req() req: any,
  ) {
    return await this.missionService.create(createMissionDto);
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
