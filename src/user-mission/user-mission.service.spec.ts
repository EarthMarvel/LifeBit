import { Test, TestingModule } from '@nestjs/testing';
import { UserMissionService } from './user-mission.service';

describe('UserMissionService', () => {
  let service: UserMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMissionService],
    }).compile();

    service = module.get<UserMissionService>(UserMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
