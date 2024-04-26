import { Injectable } from '@nestjs/common';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';

@Injectable()
export class UserMissionService {
  create(createUserMissionDto: CreateUserMissionDto) {
    return 'This action adds a new userMission';
  }

  findAll() {
    return `This action returns all userMission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userMission`;
  }

  update(id: number, updateUserMissionDto: UpdateUserMissionDto) {
    return `This action updates a #${id} userMission`;
  }

  remove(id: number) {
    return `This action removes a #${id} userMission`;
  }
}
