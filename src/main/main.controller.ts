import { Body, Render, Res } from '@nestjs/common';
import {
    Controller,
    Get,
    Query,
  } from '@nestjs/common';
import { Response } from 'express';
import { MainService } from './main.service';
import { MissionType } from '../mission/types/missionType';
import { Category } from '../mission/types/category';

@Controller('main')
export class MainController {

    constructor(
        private readonly mainService : MainService
    ) {}

    /**
     * 메인 조회
     * @returns 
     */
    @Get('/')
    @Render('main.ejs')
    async main() {
        const data = await this.mainService.main();
        return { data };
    }

    /**
     * 검색
     * @param category 
     * @param sort 
     * @param title 
     * @param res 
     * @returns 
     */
    @Get('/search')
    @Render('main.ejs')
    async search(@Query('category') category : Category, 
        @Query('sort') sort : string, 
        @Query('type') type : MissionType,
        @Query('title') title : string,
        @Res() res : Response) {

        const data = await this.mainService.search(category, sort, title, type);
        return { data }; 
    }
}
