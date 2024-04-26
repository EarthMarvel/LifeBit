import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';

@Controller('user-mission')
export class UserMissionController {
  constructor(private readonly userMissionService: UserMissionService) {}

  @Post()
  create(@Body() createUserMissionDto: CreateUserMissionDto) {
    return this.userMissionService.create(createUserMissionDto);
  }

  @Get()
  findAll() {
    return this.userMissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userMissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserMissionDto: UpdateUserMissionDto) {
    return this.userMissionService.update(+id, updateUserMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userMissionService.remove(+id);
  }
}
