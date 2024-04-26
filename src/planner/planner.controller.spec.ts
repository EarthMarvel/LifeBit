import { Test, TestingModule } from '@nestjs/testing';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { Planner } from './entity/planner.entity';

describe('PlannerController', () => {
  let plannerController: PlannerController;

  const plannerService = {
    myPage : jest.fn(),
    getPlanner : jest.fn(),
    updatePlanner : jest.fn(),
    postTodo : jest.fn(),
    updateTodo : jest.fn(),
    deleteTodo : jest.fn(),
    checkTodo : jest.fn(),
    authTodo : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlannerController],
      providers : [
        {
          provide: PlannerService,
          useValue: plannerService,
        }
      ]
    }).compile();
    
    plannerController = module.get<PlannerController>(PlannerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const responseMock: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };


  const mockUser = {
    user_id: 1,
    email: "test@test.com",
    password: "testpassword",
    name: "testname",
  } as User;

  const mockPlanner = {
    plannerId: 1,
    task: [], 
    user: mockUser, 
    name: "testname",
    description: "testdescription",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Planner;

  const mockTaskDto: TaskDto = {
    todo: 'Task 1',
    startDate: new Date(),
    // endDate: new Date(),
    // startTime: new Date(),
    // endTime: new Date(),
    authDate: new Date(),
    authYn: false,
    checkYn: false,
    planner : mockPlanner,
    authSum: 0, 
  };

  // it('마이페이지 호출 - controller', async () => {

  //   const mockData = {
  //     month_tasks_list: [],
  //     today_task: [],
  //     planner_info: {
  //       name: 'Test Planner',
  //       description: 'Test Description',
  //       plannerId: 1,
  //     },
  //   };

  //   plannerService.myPage.mockResolvedValue(mockData);
    
  //   await plannerController.myPage(mockUser, responseMock as Response);

  //   expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  //   expect(responseMock.json).toHaveBeenCalledWith({
  //     message: "마이 페이지를 조회했습니다.",
  //     data: mockData,
  //   });
  // });

  
  it('플래너 수정 - controller', async () => {

    const mockPlannerId = 1; 
    const mockPlannerDto = { name: "변경된 name", description: "변경된 description" }; 

    plannerService.updatePlanner.mockResolvedValue(mockPlannerDto); 

    await plannerController.updatePlanner(mockPlannerId, mockPlannerDto, responseMock as Response); 

    expect(plannerService.updatePlanner).toHaveBeenCalledWith(mockPlannerDto, mockPlannerId); 
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK); 
    expect(responseMock.json).toHaveBeenCalledWith({ 
      message : "플래너가 수정되었습니다.",
      data: mockPlannerDto,
    });
  });

  it('일정 등록 - controller', async () => {

    const mockPlannerId = 1;
  
    const mockResponse = {
      message: '일정을 등록했습니다.',
      data: {authData : new Date()},
    };

    plannerService.postTodo.mockResolvedValue(mockResponse.data);

    await plannerController.postTodo(
      mockPlannerId,
      mockTaskDto,
      responseMock as Response,
    );

    expect(plannerService.postTodo).toHaveBeenCalledWith(
      mockTaskDto,
      mockPlannerId,
    );
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(responseMock.json).toHaveBeenCalledWith(mockResponse);
    expect(responseMock.json).toHaveBeenCalledWith({ 
      message : "일정을 등록했습니다.",
      data: mockResponse.data,
    });
  });

  it('일정 수정 - controller', async () => {
    const mockTaskId = 1;

    plannerService.updateTodo.mockResolvedValue(mockTaskDto);

    await plannerController.updateTodo(mockTaskId, mockTaskDto, responseMock as Response);

    expect(plannerService.updateTodo).toHaveBeenCalledWith(mockTaskId, mockTaskDto);
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(responseMock.json).toHaveBeenCalledWith({
        message: '일정이 수정되었습니다.',
        data: mockTaskDto,
    });
});

it('일정 삭제 - controller', async () => {
  const mockTaskId = 1;

  plannerService.deleteTodo.mockResolvedValue({ message: 'success' });

  await plannerController.deleteTodo(mockTaskId, responseMock as Response);

  expect(plannerService.deleteTodo).toHaveBeenCalledWith(mockTaskId);
  expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  expect(responseMock.json).toHaveBeenCalledWith({
      message: '일정이 삭제되었습니다.',
      data: { message: 'success' },
  });
});

it('일정 체크/언체크 - controller', async () => {
  const mockTaskId = 1;

  plannerService.checkTodo.mockResolvedValue({ message: 'success' });

  await plannerController.checkTodo(mockTaskId, responseMock as Response);

  expect(plannerService.checkTodo).toHaveBeenCalledWith(mockTaskId);
  expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  expect(responseMock.json).toHaveBeenCalledWith({
      message: '일정이 체크 / 언체크 되었습니다.',
      data: { message: 'success' },
  });
});

it('일정 인증 - controller', async () => {
  const mockTaskId = 1;

  plannerService.authTodo.mockResolvedValue({ message: 'success' });

  await plannerController.authTodo(mockTaskId, responseMock as Response);

  expect(plannerService.authTodo).toHaveBeenCalledWith(mockTaskId);
  expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  expect(responseMock.json).toHaveBeenCalledWith({
      message: '일정이 인증되었습니다.',
      data: { message: 'success' },
  });
});


});
