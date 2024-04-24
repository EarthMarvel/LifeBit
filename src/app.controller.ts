import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.ejs')
  getIndex(@Req() req: Request): { isLoggedIn: boolean } {
    return { isLoggedIn: req['isLoggedIn'] };
  }
}
