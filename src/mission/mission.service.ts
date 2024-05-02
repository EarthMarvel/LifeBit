import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Mission } from './entities/mission.entity';
import { Point } from 'src/point/entity/point.entity';
// import { UserMission } from 'src/user-mission/entities/user-mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { DataSource, Repository } from 'typeorm';
import { S3Service } from 'src/user/s3.service';
import { extname } from 'path';
import { number } from 'joi';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(CertificatedImage)
    private certificatedImageRepository: Repository<CertificatedImage>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    user_id: number,
    createMissionDto: CreateMissionDto,
    file: Express.Multer.File,
  ): Promise<{ mission?: Mission; message: string }> {
    try {
      // 사용자 검색
      const user = await this.userRepository.findOne({
        where: { user_id },
      });
      if (!user) {
        throw new BadRequestException(
          `사용자를 찾을 수 없습니다: user_id=${user_id}`,
        );
      }

      // 미션 객체 생성
      const savedMission = this.missionRepository.create(createMissionDto);
      savedMission.creatorId = user.user_id;

      const { title, category, startDate, endDate, numberPeople, description } =
        createMissionDto;

      if (file) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        const fileExt = extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
          throw new BadRequestException(
            '올바른 JPG, JPEG, PNG, GIF 파일이 아닙니다.',
          );
        }

        console.log('createMission : file : ' + file);
        console.log('createMission : file.path : ' + file.path);
        console.log('createMission : fileExt : ' + fileExt);

        await this.s3Service.putObject(file);

        if (savedMission.thumbnail) {
          await this.s3Service.deleteObject(savedMission.thumbnail);
        }

        savedMission.title = title;
        savedMission.category = category;
        savedMission.startDate = startDate;
        savedMission.endDate = endDate;
        savedMission.numberPeople = numberPeople;
        savedMission.description = description;
        savedMission.thumbnail = file.filename;

        // 미션 저장
        await this.missionRepository.save(savedMission);
      }

      return {
        mission: savedMission,
        message: '미션이 성공적으로 등록되었습니다.',
      };
    } catch (error) {
      console.error(`Error in create method: ${error.message}`);
      throw new BadRequestException(
        `미션 생성에 실패했습니다: ${error.message}`,
      );
    }
  }

  async findOne(missionId: number): Promise<Mission> {
    // missionId 값 검증
    if (missionId === null || isNaN(missionId)) {
      throw new BadRequestException(`Invalid mission ID: ${missionId}`);
    }

    const mission = await this.missionRepository.findOne({
      where: { missionId },
    });

    // 미션이 존재하지 않을 경우 예외 던지기
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    // 미션 반환
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
    // 미션을 조회하여 가져옵니다.
    const mission = await this.findOne(id);
    await this.certificatedImageRepository.delete({ mission });

    // `mission` 테이블에서 미션을 삭제합니다.
    const missionDeleteResult = await this.missionRepository.delete(id);

    // `mission` 데이터 삭제 결과를 확인합니다.
    if (missionDeleteResult.affected === 0) {
      throw new NotFoundException(
        `미션 삭제 실패: ID ${id}에 해당하는 미션을 찾을 수 없습니다.`,
      );
    }

    // 미션 삭제가 완료된 경우 결과와 메시지를 반환합니다.
    return {
      result: missionDeleteResult,
      message: '미션 삭제 완료',
    };
  }

  async update(
    user_id: number,
    id: number,
    updateMissionDto: UpdateMissionDto,
    file: Express.Multer.File,
  ): Promise<{ mission?: Mission; message: string }> {
    // 사용자 검색
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new BadRequestException(
        `사용자를 찾을 수 없습니다: user_id=${user_id}`,
      );
    }

    // 현재 미션 가져오기
    const currentMission = await this.findOne(id);
    if (!currentMission) {
      throw new NotFoundException(`미션을 찾을 수 없습니다: id=${id}`);
    }

    // 업로드된 파일 처리
    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const fileExt = extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(fileExt)) {
        throw new BadRequestException(
          '올바른 JPG, JPEG, PNG, GIF 파일이 아닙니다.',
        );
      }

      // S3에 업로드
      const filePath = await this.s3Service.putObject(file);

      // 파일 업로드 함수가 'string' 타입의 파일 경로를 반환하도록 수정합니다.
      if (currentMission.thumbnail) {
        await this.s3Service.deleteObject(currentMission.thumbnail);
      }

      // filePath가 string 타입이 아닐 경우 오류를 발생시킵니다.
      if (typeof filePath !== 'string') {
        throw new Error('파일 업로드에 실패하여 파일 경로를 얻을 수 없습니다.');
      }

      // 미션의 썸네일 업데이트
      currentMission.thumbnail = filePath;
    }

    // 미션 정보 업데이트
    currentMission.title = updateMissionDto.title;
    currentMission.category = updateMissionDto.category;
    currentMission.startDate = new Date(updateMissionDto.startDate);
    currentMission.endDate = new Date(updateMissionDto.endDate);
    currentMission.numberPeople = updateMissionDto.numberPeople;
    currentMission.description = updateMissionDto.description;

    // 업데이트된 미션 저장
    const savedMission = await this.missionRepository.save(currentMission);

    // 결과 반환
    return {
      mission: savedMission,
      message: '미션이 정상적으로 수정되었습니다.',
    };
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
}
