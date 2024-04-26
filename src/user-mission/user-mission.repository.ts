import { Repository } from 'typeorm';
import { UserMission } from './entities/user-mission.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserMissionRepository extends Repository<UserMission> {
  constructor(
    @InjectRepository(UserMission)
    private readonly userMissionRepository: Repository<UserMission>,
  ) {
    super(
      userMissionRepository.target,
      userMissionRepository.manager,
      userMissionRepository.queryRunner,
    );
  }

  // 여기에 커스텀 메서드를 정의할 수 있습니다.
  async findByUserId(userId: number): Promise<UserMission[]> {
    return await this.find({ where: { user: { user_id: userId } } });
  }

  // 다른 메서드를 정의할 수 있습니다.
}
