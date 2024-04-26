import { Controller, Get, Render } from '@nestjs/common';
import { PointService } from './point.service';

@Controller('')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get('ranking')
  @Render('ranking.ejs')
  async getRanking() {
    const usersPoint = await this.pointService.allPointView();
    return { usersPoint };
  }
}
