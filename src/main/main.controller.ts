import { Body, Res } from '@nestjs/common';
import {
    Controller,
    Get,
    HttpStatus,
    Query,
  } from '@nestjs/common';
import { Response } from 'express';
import { MainService } from './main.service';
import { MissionType } from '../mission/types/missionType';
import { MainDto } from './dto/main.dto';
import { Category } from '../mission/types/category';

@Controller('main')
export class MainController {

    constructor(
        private readonly mainService : MainService
    ) {}
        

    /**
     * 메인 조회
     * @param category 
     * @param sort 
     * @param title 
     * @param res 
     * @returns 
     */
    @Get('/')
    async main(@Query('category') category : Category, 
        @Query('sort') sort : string, 
        @Query('type') type : MissionType,
        @Body() mainDto : MainDto,
        @Res() res : Response) {
            
        return res.status(HttpStatus.OK).json({
            message : "메인 페이지를 조회했습니다",
            data : await this.mainService.main(category, sort, mainDto.title, type)
        });
    }
}
