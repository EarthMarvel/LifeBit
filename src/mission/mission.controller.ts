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
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionType } from './types/missionType';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { userInfo } from 'os';
import { UserService } from 'src/user/user.service';

@Controller('mission') // 기본 경로로 설정되어 있음
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly userService: UserService,
  ) {}

  // 미션 생성 페이지
  @Get('/create')
  createMissionPage(@Res() res: Response) {
    // views 디렉토리 경로를 기준으로 템플릿 파일의 경로를 수정
    res.render(
      '/Users/_woo_s.j/Desktop/workspace/earth-marvel/views/createMissionPage.ejs',
      {
        image: '/LifeBit.png',
        imagePath: '/imagePath',
        challengeCreationTitle: '제목',
        uploadBtnText: 'upload',
        challengeTitlePlaceholder: '미션 제목을 입력해주세요.',
        descriptionPlaceholder: 'descriptionPlaceholder',
        submitBtnText: '등록하기',
        mission: 'Create Mission',
      },
    );
  }

  // 미션 등록
  // POST /mission
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createMission(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMissionDto: CreateMissionDto,
    @Req() req: any,
  ) {
    // `req.user` 객체가 `null`이나 `undefined`인지 확인
    if (!req.user) {
      throw new NotFoundException('User not found in request');
    }

    // `req.user.email`을 기반으로 사용자를 조회
    const user = await this.userService.getUserByEmail(req.user.email);

    // 사용자 존재 여부 확인
    if (!user) {
      throw new NotFoundException(
        `User with email ${req.user.email} not found`,
      );
    }

    // 미션 생성 요청을 `MissionService`로 전달하고 결과를 반환합니다.
    const createdMission = await this.missionService.create(
      createMissionDto,
      user.user_id,
      file,
    );

    // 사용자가 미션을 생성한 후 UserMission에 추가
    await this.missionService.addUserMission(
      createdMission.mission.missionId,
      user.user_id,
    );

    return {
      mission: createdMission,
      message: '미션 생성 완료',
    };
  }

  // 미션 목록 조회
  // GET /mission
  @Get()
  async getMissionList(@Req() req: any, @Res() res: Response) {
    try {
      // 미션 서비스에서 모든 미션 목록을 가져옴
      const missionList = await this.missionService.findAll();

      // 미션 목록을 클라이언트에 반환
      res.status(200).json({
        message: '미션 목록 조회 완료',
        missions: missionList,
      });
    } catch (error) {
      // 에러 처리
      res.status(500).json({
        message: `Error: ${error.message}`,
      });
    }
  }

  @Get('/:missionId')
  async findMissionById(
    @Param('missionId') missionId: number,
    @Res() res: Response,
  ) {
    try {
      // 1. missionId를 사용하여 비동기적으로 미션 데이터를 로드
      const mission = await this.missionService.findOne(missionId);

      // 2. 미션 데이터가 존재하지 않는 경우 404 오류 반환
      if (!mission) {
        res.status(404).send('Mission not found');
        return;
      }

      // 3. 데이터 로딩이 완료되었으므로 EJS 템플릿을 렌더링하며 미션 데이터를 전달
      res.render(
        '/Users/_woo_s.j/Desktop/workspace/earth-marvel/views/missionDetailPage.ejs',
        {
          challengeTitle: mission.title, // 챌린지 제목
          challengeCategory: mission.category, // 챌린지 카테고리
          challengePeriod: `${mission.startDate.toISOString().substring(0, 10)} - ${mission.endDate.toISOString().substring(0, 10)}`,
          challengeCapacity: mission.numberPeople,
          challengeDescription: mission.description,
          // participants: mission.participants || ['짱구', '철수', '맹구', '수지'], // 참가자 목록이 있는 경우 전달
          missionId: mission.missionId, // 미션 ID를 전달
        },
      );
    } catch (error) {
      // 4. 에러 처리
      res.status(500).send(`Error: ${error.message}`);
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
