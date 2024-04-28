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
  @Render('createMissionPage.ejs')
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
      throw new BadRequestException(
        `미션 생성에 실패했습니다: ${error.message}`,
      );
    }
  }

  @Get()
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
  @Render('missionDetailPage.ejs')
  async findMissionById(@Param('missionId') missionId: number) {
    try {
      if (missionId === null || isNaN(missionId)) {
        throw new BadRequestException('Invalid mission ID provided');
      }

      const mission = await this.missionService.findOne(missionId);

      if (!mission) {
        throw new NotFoundException('Mission not found');
      }

      return {
        challengeTitle: mission.title,
        challengeCategory: mission.category,
        challengePeriod: `${mission.startDate.toISOString().substring(0, 10)} - ${mission.endDate.toISOString().substring(0, 10)}`,
        challengeStartDate: mission.startDate,
        challengeEndDate: mission.endDate,
        challengeNumberPeople: mission.numberPeople,
        challengeDescription: mission.description,
        missionId: mission.missionId,
      };
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
      throw new InternalServerErrorException(`${error}`);
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
}
