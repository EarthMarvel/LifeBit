import { Test, TestingModule } from '@nestjs/testing';
import { MainService } from './main.service';
import { Repository } from 'typeorm';
import { Mission } from '../mission/entities/mission.entity';

describe('MainService', () => {
  let service: MainService;
  let missionRepository: Partial<Record<keyof Repository<Mission>, jest.Mock>>;

  beforeEach(async () => {
   
    const mockMissions = [
      { id: 1, title: 'Mission 1', category: 'category1', type: 'type1' },
      { id: 2, title: 'Mission 2', category: 'category2', type: 'type2' },
    ];
    
    const missionRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockMissions),
      })),
    };

  }).compile();
});

  afterEach(() => {
    jest.clearAllMocks();
  });

it('main test', async () => {
 
  // 테스트 메서드 호출
  const result = await service.main('category1', 'ASC', '', '');

  // 결과 검증
  expect(result).toEqual(mockMissions);
  expect(missionRepository.createQueryBuilder).toHaveBeenCalled();
});

});
