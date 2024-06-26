import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Render,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('mission')
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/createMission')
  @Render('mission-create.ejs')
  createMissionPage() {
    return {
      image: '/LifeBit.png',
      imagePath: '/imagePath',
      challengeCreationTitle: '제목',
      uploadBtnText: 'upload',
      challengeTitlePlaceholder: '미션 제목을 입력해주세요.',
      descriptionPlaceholder: 'descriptionPlaceholder',
      submitBtnText: '등록하기',
      mission: 'Create Mission',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createMission(
    @UserInfo() user: User,
    @Body() createMissionDto: CreateMissionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const createdMission = await this.missionService.create(
        user.user_id,
        createMissionDto,
        file,
      );

      if (
        !createdMission ||
        !createdMission.mission ||
        !createdMission.mission.missionId
      ) {
        throw new BadRequestException('미션 생성에 실패했습니다.');
      }

      return { mission: createdMission };
    } catch (error) {
      console.error(`Error in createMission method: ${error.message}`);
      console.error(`Uploaded file info: ${file && file.originalname}`);
    }
  }

  @Get('/main')
  @Render('mission-main.ejs')
  async getMissionList() {
    try {
      const missionList = await this.missionService.findAll();
      return {
        message: '미션 목록 조회 완료',
        missions: missionList,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  @Get('/:missionId')
  @Render('mission-detail.ejs')
  async findMissionById(
    @Param('missionId') missionId: number,
    @UserInfo() user: User,
  ) {
    try {
      if (missionId === null || isNaN(missionId)) {
        throw new BadRequestException('Invalid mission ID provided');
      }

      const mission = await this.missionService.findOne(missionId);

      if (!mission) {
        throw new NotFoundException('Mission not found');
      }

      return { mission /*currentUserId*/ };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Error: ${error.message}`);
      }
    }
  }

  @Delete('/:missionId')
  async delete(@Param('missionId') missionId: number, @Req() req: any) {
    try {
      const userId = req.user_id;
      const result = await this.missionService.remove(+missionId, userId);
      if (result) {
        return { message: '미션 삭제 완료', result };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          '삭제할 미션을 찾을 수 없습니다. 올바른 미션 ID를 입력해주세요.',
        );
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('해당 미션을 삭제할 권한이 없습니다.');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  // 미션 수정 페이지를 렌더링하고 미션 정보를 수정하는 엔드포인트
  @Get('/update/:missionId')
  @Render('mission-update.ejs')
  async getMissionUpdatePage(
    @Param('missionId') missionId: number,
  ): Promise<any> {
    try {
      // 미션 ID를 통해 미션 정보
      const mission = await this.missionService.findOne(missionId);

      // 미션 정보를 객체 형태로 구성하여 반환
      return {
        mission: {
          missionId: mission.missionId,
          category: mission.category,
          startDate: mission.startDate.toISOString().split('T')[0],
          endDate: mission.endDate.toISOString().split('T')[0],
          numberPeople: mission.numberPeople,
          authSum: mission.authSum,
          creatorId: mission.creatorId,
          title: mission.title,
          description: mission.description,
          thumbnail: mission.thumbnail,
        },
      };
    } catch (error) {
      console.error(`Error getting mission info: ${error.message}`);
      throw new InternalServerErrorException(
        '미션 정보를 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  @Put('/:missionId')
  async update(
    @Param('missionId') missionId: number,
    @Body() updateMissionDto: UpdateMissionDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // 요청에서 userId를 추출
      const userId = req.userId;

      // 서비스 레이어의 update 메서드를 사용하여 미션을 수정
      const updatedMission = await this.missionService.update(
        userId,
        +missionId,
        updateMissionDto,
        file,
      );

      // 수정된 미션 정보를 JSON 응답으로 반환
      return {
        message: '미션 수정 완료',
        mission: updatedMission,
      };
    } catch (error) {
      // 오류 메시지를 로깅
      console.error(`Error updating mission: ${error.message}`);

      // 오류 종류에 따라 예외를 처리
      if (error instanceof BadRequestException) {
        throw new BadRequestException('잘못된 요청 데이터입니다.');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('미션을 찾을 수 없습니다.');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('권한이 부족합니다.');
      } else {
        // 그 외의 예외는 내부 서버 오류로 간주
        throw new InternalServerErrorException(
          '미션 수정 중 오류가 발생했습니다.',
        );
      }
    }
  }
}
