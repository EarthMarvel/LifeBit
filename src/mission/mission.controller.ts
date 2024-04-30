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
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionType } from './types/missionType';
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

      await this.missionService.addUserMission(
        createdMission.mission.missionId,
        user.user_id,
      );

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
  async findMissionById(@Param('missionId') missionId: number) {
    try {
      if (missionId === null || isNaN(missionId)) {
        throw new BadRequestException('Invalid mission ID provided');
      }

      const mission = await this.missionService.findOne(missionId);

      if (!mission) {
        throw new NotFoundException('Mission not found');
      }

      return mission;
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
      return await this.missionService.remove(+missionId, userId);
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  // 미션 수정 페이지를 렌더링하고 미션 정보를 수정하는 엔드포인트
  //@UseGuards(JwtAuthGuard)
  @Get('/update/:missionId')
  @Render('mission-update.ejs')
  async getMissionUpdatePage(
    @Param('missionId') missionId: number,
  ): Promise<any> {
    try {
      // 미션 ID를 통해 미션 정보를 가져옵니다.
      const mission = await this.missionService.findOne(missionId);

      // 미션 정보를 객체 형태로 구성하여 반환합니다.
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
  ) {
    try {
      const updatedMission = await this.missionService.update(
        req.userId,
        +missionId,
        updateMissionDto,
      );

      return {
        message: '미션 수정 완료',
        mission: updatedMission,
      };
    } catch (error) {
      console.error(`Error updating mission: ${error.message}`);
      throw new InternalServerErrorException(
        '미션 수정 중 오류가 발생했습니다.',
      );
    }
  }
}
