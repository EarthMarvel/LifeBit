import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    private dataSource: DataSource,
  ) {}

  async create(createMissionDto: CreateMissionDto, userId: number) {
    const mission = this.missionRepository.create(createMissionDto);

    mission.userId = userId;

    await this.missionRepository.save(mission);

    return { mission, message: '미션 생성 완료' };
  }

  async findOne(id: number) {
    const mission = await this.missionRepository.findOneBy({ missionId: id });

    if (!mission) {
      throw new NotFoundException('해당 mission은 존재하지 않습니다.');
    }

    return mission;
  }

  async remove(id: number, userId: number) {
    const mission = await this.findOne(id);

    if (mission.userId !== userId) {
      throw new UnauthorizedException('해당 미션을 삭제할 권한이 없습니다.');
    }

    const result = await this.missionRepository.delete(id);
    return { result, message: 'Mission 삭제 완료' };
  }

  async update(userId: number, id: number, updateMissionDto: UpdateMissionDto) {
    const mission = await this.findOne(id);

    if (mission.userId !== userId) {
      throw new UnauthorizedException('해당 미션을 수정할 권한이 없습니다.');
    }

    this.missionRepository.merge(mission, updateMissionDto);
    const updatedMission = await this.missionRepository.save(mission);
    return { updatedMission, message: '미션이 정상적으로 수정되었습니다.' };
  }
}
