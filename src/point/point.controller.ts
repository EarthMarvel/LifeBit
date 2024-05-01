import { Controller, Get, Render, Req } from '@nestjs/common';
import { PointService } from './point.service';

@Controller('')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get('ranking')
  @Render('ranking.ejs')
  async getRanking(@Req() req: Request) {
    const usersPoint = await this.pointService.allPointView();
    console.log(usersPoint);
    return { usersPoint, isLoggedIn: req['isLoggedIn'] };
  }
}
