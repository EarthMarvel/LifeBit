import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { MissionType } from '../mission/types/missionType';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Category } from '../mission/types/category';

describe('MainController', () => {
  let controller: MainController;

  const mainService = {
    main : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
      providers: [
        {
          provide: MainService,
          useValue: mainService,
        }
      ]
    }).compile();
    controller = module.get<MainController>(MainController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('메인 페이지 호출 - controller', async () => {
    const mockCategory = Category.ART;
    const mockSort = 'mockSort';
    const mockType = MissionType.CHALLENGE;
    const mockMainDto = { title: 'mockTitle' };
    const mockData = ['mockData1', 'mockData2'];

    mainService.main.mockResolvedValueOnce(mockData);

    const responseMock: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await controller.main();
    // await controller.main(mockCategory, 
    //   mockSort, 
    //   mockType, 
    //   mockMainDto,
    //   responseMock as Response);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({
        message: '메인 페이지를 조회했습니다',
        data: mockData,
      });
      expect(mainService.main).toHaveBeenCalledWith(
        mockCategory,
        mockSort,
        mockMainDto.title,
        mockType,
      );  
  });
});
