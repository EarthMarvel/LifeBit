import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Mission } from './entities/mission.entity';
import { Point } from 'src/point/entity/point.entity';
import { UserMission } from 'src/user-mission/entities/user-mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(UserMission)
    private userMissionRepository: Repository<UserMission>,
    private dataSource: DataSource,
  ) {}

  async create(
    createMissionDto: CreateMissionDto,
    userId: number,
    file: Express.Multer.File,
  ): Promise<{ mission: Mission; message: string }> {
    // 새로운 미션 객체 생성
    const mission = new Mission();

    // 입력 데이터 DTO에서 미션 객체로 복사
    mission.title = createMissionDto.title;
    mission.category = createMissionDto.category;
    mission.startDate = createMissionDto.startDate;
    mission.endDate = createMissionDto.endDate;
    mission.numberPeople = createMissionDto.numberPeople;
    mission.description = createMissionDto.description;

    // userId를 User 객체로 조회
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 미션 객체를 데이터베이스에 저장
    const savedMission = await this.missionRepository.save(mission);

    // 미션 생성자의 아이디와 미션의 아이디를 UserMission 엔티티에 추가
    await this.addUserMission(savedMission.missionId, userId);

    // 응답 준비
    return { mission: savedMission, message: '미션 생성 완료' };
  }

  async findOne(missionId: number): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { missionId },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    return mission;
  }

  // 모든 미션 목록을 가져오는 메서드
  async findAll(): Promise<Mission[]> {
    // 미션 레포지토리를 통해 모든 미션을 가져옴
    const missions = await this.missionRepository.find();

    // 가져온 미션 목록을 반환
    return missions;
  }

  async remove(id: number, userId: number) {
    const mission = await this.findOne(id);

    /*
    if (mission.user_id !== userId) {
      throw new UnauthorizedException('해당 미션을 삭제할 권한이 없습니다.');
    }
    */

    const result = await this.missionRepository.delete(id);
    return { result, message: 'Mission 삭제 완료' };
  }

  async update(userId: number, id: number, updateMissionDto: UpdateMissionDto) {
    const mission = await this.findOne(id);

    console.log('userInfo : ' + User.name); // null

    /*
    if (mission.user_id !== userId) {
      throw new UnauthorizedException('해당 미션을 수정할 권한이 없습니다.');
    }
    */

    this.missionRepository.merge(mission, updateMissionDto);
    const updatedMission = await this.missionRepository.save(mission);
    return { updatedMission, message: '미션이 정상적으로 수정되었습니다.' };
  }

  // 이메일로 User 엔티티 조회
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // 사용자 존재 여부 확인
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // 조회된 User 객체 반환
    return user;
  }

  // UserMission 추가
  async addUserMission(missionId: number, userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    const mission = await this.missionRepository.findOne({
      where: { missionId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const userMission = new UserMission();
    userMission.user = user;
    userMission.mission = mission;
    userMission.participationDate = new Date();

    await this.userMissionRepository.save(userMission);
  }
}
