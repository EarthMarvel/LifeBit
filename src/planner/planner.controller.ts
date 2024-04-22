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
import { TaskDto } from './dto/task.dto';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';
import { User } from 'src/user/entities/user.entity';
import { PlannerService } from './planner.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { AuthGuard } from '@nestjs/passport';

//@UseGuards(JwtAuthGuard)
@Controller('myPage')
@UseGuards(AuthGuard('jwt'))
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

    /**
     * 마이페이지 호출
     * @param user 
     * @param res 
     * @returns 
     */
    @Get('/')
    async myPage(@UserInfo() user: User, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "마이 페이지를 조회했습니다.",
        data : await this.plannerService.myPage(user)
        })
    }

    /**
     * 플래너 조회
     * @param plannerId
     * @param dateDto 
     * @param res 
     * @returns 
     */
    @Get('/planner')
    async getPlanner(@Query('plannerId') plannerId : number, @Body() dateDto : DateDto, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "플래너를 조회했습니다.",
        data : await this.plannerService.getPlanner(dateDto, plannerId)
        })
    }


    /**
     * 플래너 수정
     * @param plannerId 
     * @param plannerDto 
     * @param res 
     * @returns 
     */
    @Put('/planner')
    async updatePlanner(@Query('plannerId') plannerId : number, @Body() plannerDto : PlannerDto, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "플래너가 수정되었습니다.",
        data : await this.plannerService.updatePlanner(plannerDto, plannerId)
        })
    }


    /**
     * 일 등록
     * @param plannerId 
     * @param taskDto 
     * @param res 
     * @returns 
     */
    @Post('/todo')
    async postTodo(@Query('plannerId') plannerId : number, @Body() taskDto : TaskDto, @Res() res : Response) {
        
        return res.status(HttpStatus.CREATED).json({
        message : "일정을 등록했습니다.",
        data : await this.plannerService.postTodo(taskDto, plannerId)
        })
    }


    /**
     * 일 수정
     * @param taskId 
     * @param taskDto 
     * @param res 
     * @returns 
     */
    @Put('/todo')
    async updateTodo(@Query('taskId') taskId : number, @Body() taskDto : TaskDto , @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "일정이 수정되었습니다.",
        data : await this.plannerService.updateTodo(taskId, taskDto)
        })
    }


    /**
     * 일 삭제
     * @param taskId 
     * @param res 
     * @returns 
     */
    @Delete('/todo')
    async deleteTodo(@Query('taskId') taskId : number, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "일정이 삭제되었습니다.",
        data : await this.plannerService.deleteTodo(taskId)
        })
    }


    /**
     * 일 체크, 언체크
     * @param taskId 
     * @param res 
     * @returns 
     */
    @Post('/todo/check')
    async checkTodo(@Query('taskId') taskId : number, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "일정이 체크 / 언체크 되었습니다.",
        data : await this.plannerService.checkTodo(taskId)
        })
    }


    /**
     * 일 인증
     * @param taskId 
     * @param res 
     * @returns 
     */
    @Post('/todo/auth')
    async authTodo(@Query('taskId') taskId : number, @Res() res : Response) {

        return res.status(HttpStatus.OK).json({
        message : "일정이 인증되었습니다.",
        data : await this.plannerService.authTodo(taskId)
        })
    }

  /**
   * 내 미션 확인하기
   */

}
