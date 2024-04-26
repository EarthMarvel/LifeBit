import { Test, TestingModule } from '@nestjs/testing';
import { MainService } from './main.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Mission } from '../mission/entities/mission.entity';
import { Category } from 'src/mission/types/category';
import { MissionType } from 'src/mission/types/missionType';

describe('MainService', () => {
  let mainService : MainService;
  let missionRepository: Partial<Record<keyof Repository<Mission>, jest.Mock>>;

  const mockMissions = [
    { id: 1, title: 'Mission 1', category: Category.ART, type: MissionType.CHALLENGE },
    { id: 2, title: 'Mission 2', category: Category.ART, type: MissionType.CHALLENGE },
  ];

  beforeEach(async () => {

    const missionRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([mockMissions]),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainService,
        {
          provide : getRepositoryToken(Mission),
          useValue : missionRepositoryMock
        }
      ],
    }).compile();
  
    mainService = module.get<MainService>(MainService);
    missionRepository = module.get(getRepositoryToken(Mission)); //beforeEach 블록 내에서 정의한 missionRepository를 사용
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

it('메인페이지 호출 - service', async () => {
 
  // 테스트 메서드 호출
  //const result = await mainService.main(Category.ART, 'ASC', '', MissionType.CHALLENGE);
  const result = await mainService.main();

  // 결과 검증
  expect(result).toEqual([mockMissions]);
  expect(missionRepository.createQueryBuilder).toHaveBeenCalled();
});

});
