import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Res } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { Response } from 'express';
import { TodoDto } from './dto/todo.dto';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';

@Controller('myPage')
export class PlannerController {
    constructor(private readonly plannerService : PlannerService) {}

    /**
     * 처음 마이페이지 접근할 때 호출될 API
     * 이번 달 계획 / 오늘 계획 (오늘 계획은 시간 데이터까지 필요하다)
     * user 로직과 통합 시 -> userinfo 에서 user 조회 예정
     */
    @Get('/')
    async myPage(@Res() res : Response) {
        const userId = 1; //가드 필요

        return res.status(HttpStatus.OK).json({
        message : "마이 페이지를 조회했습니다.",
        data : await this.plannerService.myPage(userId)
        })
    }

    /**
     * 플래너 조회
     */
    @Get('/planner')
    async getPlanner(@Body() dateDto : DateDto, @Res() res : Response) {
        const plannerId = 1;

        return res.status(HttpStatus.OK).json({
        message : "플래너를 조회했습니다.",
        data : await this.plannerService.getPlanner(dateDto, plannerId)
        })
    }

    /**
     * 플래너 수정 (여기서부터 작업)
     */
    @Put('/planner')
    async updatePlanner(@Body() plannerDto : PlannerDto, @Res() res : Response) {
        const plannerId = 1;

        return res.status(HttpStatus.OK).json({
        message : "플래너가 수정되었습니다.",
        data : await this.plannerService.updatePlanner(plannerDto, plannerId)
        })
    }

        
    /**
     * 일정 등록
     */
    @Post('/todo')
    async postTodo(@Body() todoDto : TodoDto, @Res() res : Response) {
        const planId = 1;

        return res.status(HttpStatus.CREATED).json({
        message : "일정을 등록했습니다.",
        data : await this.plannerService.postTodo(todoDto, planId)
        })
    }

    /**
     * 일정 수정
     */
    @Put('/todo')
    async updateTodo(@Body() todoDto : TodoDto, @Res() res : Response) {
        const planId = 1;

        return res.status(HttpStatus.OK).json({
        message : "일정이 수정되었습니다.",
        data : await this.plannerService.updateTodo(planId, todoDto)
        })
    }

    /**
     * 일정 삭제
     */
    @Delete('/todo')
    async deleteTodo(@Res() res : Response) {
        const planId = 1;

        return res.status(HttpStatus.OK).json({
        message : "일정이 삭제되었습니다.",
        data : await this.plannerService.deleteTodo(planId)
        })
    }

    /**
     * 일정 체크 / 언체크
     */
    @Post('/todo/check')
    async checkTodo(@Res() res : Response) {
        const planId = 2;

        return res.status(HttpStatus.OK).json({
        message : "일정이 체크 / 언체크 되었습니다.",
        data : await this.plannerService.checkTodo(planId)
        })
    }

    /**
     * 일정 인증
     * 추후 인증 API 추가
     * 추후 포인트 반영
     */
    @Post('/todo/auth')
    async authTodo(@Res() res : Response) {
        const planId = 2;

        return res.status(HttpStatus.OK).json({
        message : "일정이 인증되었습니다.",
        data : await this.plannerService.authTodo(planId)
        })
    }

    /**
     * 내 미션 확인하기 //미션 entity 올라오면 수정하기
     */


    /**
     * 프로필 사진 수정하기 //회원에서 s3 올리면 수정하기
     */

}
