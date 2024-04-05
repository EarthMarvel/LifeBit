import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';
import { TodoDto } from './dto/todo.dto';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/user/decorator/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { PlannerService } from './planner.service';

@Controller('myPage')
@UseGuards(AuthGuard('jwt'))
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  /**
   * 마이페이지 호출
   * 이번 달 계획 / 오늘 계획 (오늘 계획은 시간 데이터까지 필요하다) -> DB I/O 많음, 리팩토링 필요
   * user 로직과 통합 시 -> userinfo 에서 user 조회 예정
   * @param res
   * @returns
   */
  @Get('/')
  async myPage(@UserInfo() user: User, @Res() res: Response) {
    console.log('user : ' + user.user_id); //1
    return res.status(HttpStatus.OK).json({
      message: '마이 페이지를 조회했습니다.',
      data: await this.plannerService.myPage(user),
    });
  }

  /**
   * 플래너 조회
   * @param plannerId
   * @param user
   * @param dateDto
   * @param res
   * @returns
   */
  @Get('/planner')
  async getPlanner(
    @Query('plannerId') plannerId: number,
    @Body() dateDto: DateDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: '플래너를 조회했습니다.',
      data: await this.plannerService.getPlanner(dateDto, plannerId),
    });
  }

  /**
   * 플래너 수정
   * @param plannerDto
   * @param res
   * @returns
   */
  @Put('/planner')
  async updatePlanner(
    @Query('plannerId') plannerId: number,
    @Body() plannerDto: PlannerDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: '플래너가 수정되었습니다.',
      data: await this.plannerService.updatePlanner(plannerDto, plannerId),
    });
  }

  /**
   * 일정 등록
   * @param todoDto
   * @param res
   * @returns
   */
  @Post('/todo')
  async postTodo(
    @Query('plannerId') plannerId: number,
    @Body() todoDto: TodoDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json({
      message: '일정을 등록했습니다.',
      data: await this.plannerService.postTodo(todoDto, plannerId),
    });
  }

  /**
   * 일정 수정
   * @param todoDto
   * @param res
   * @returns
   */
  @Put('/todo')
  async updateTodo(
    @Query('planId') planId: number,
    @Body() todoDto: TodoDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: '일정이 수정되었습니다.',
      data: await this.plannerService.updateTodo(planId, todoDto),
    });
  }

  /**
   * 일정 삭제
   * @param res
   * @returns
   */
  @Delete('/todo')
  async deleteTodo(@Query('planId') planId: number, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: '일정이 삭제되었습니다.',
      data: await this.plannerService.deleteTodo(planId),
    });
  }

  /**
   * 일정 체크, 언체크
   * @param res
   * @returns
   */
  @Post('/todo/check')
  async checkTodo(@Query('planId') planId: number, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: '일정이 체크 / 언체크 되었습니다.',
      data: await this.plannerService.checkTodo(planId),
    });
  }

  /**
   * 일정 인증, 추후 인증 API 추가, 추후 포인트 반영
   * @param res
   * @returns
   */
  @Post('/todo/auth')
  async authTodo(
    @UserInfo() user: User,
    @Query('planId') planId: number,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: '일정이 인증되었습니다.',
      data: await this.plannerService.authTodo(planId),
    });
  }

  /**
   * 내 미션 확인하기
   */

  /**
   * 프로필 사진 수정하기
   */

  /**
   * 프로필 사진 수정하기 //회원에서 s3 올리면 수정하기
   */
}
