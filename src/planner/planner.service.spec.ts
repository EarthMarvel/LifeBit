import { Test, TestingModule } from '@nestjs/testing';
import { PlannerService } from './planner.service';
import { DataSource, Repository } from 'typeorm';
import { Planner } from './entity/planner.entity';
import { Task } from './entity/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
describe('PlannerService', () => {
  let service: PlannerService;
  let plannerRepository: Partial<Record<keyof Repository<Planner>, jest.Mock>>;
  let taskRepository: Partial<Record<keyof Repository<Task>, jest.Mock>>;
  let dataSource: DataSource;

  beforeEach(async () => {
    taskRepository = {
      findOneBy: jest.fn().mockImplementation(({ taskId }) => {
        if (taskId === mockTask.taskId) {
          return mockTask; // 주어진 taskId와 일치하는 일정이 있으면 해당 일정 반환
        } else {
          return null; // 주어진 taskId와 일치하는 일정이 없으면 null 반환
        }
      }),
      save: jest.fn(),

      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnValueOnce({
          into: jest.fn().mockReturnThis(),
          values: jest.fn().mockReturnThis(), 
          execute: jest.fn().mockResolvedValue([mockTask]), 
        }),
        update: jest.fn().mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          execute: jest.fn().mockReturnValueOnce([mockTask]),
        }),
        getMany: jest.fn().mockResolvedValue([mockTask]) 
      })),
    };

    plannerRepository = {
      findOneBy: jest.fn().mockImplementation(({ user, plannerId }) => {
        if (user) {
          if (user.user_id === mockPlanner.user.user_id) {
            return mockPlanner;
          } else {
            return null; 
          }
        } else if (plannerId) {
          if (mockPlanner.plannerId === plannerId) {
            return mockPlanner;
          } else {
            return null;
          }
        }
      }),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          execute: jest.fn().mockReturnValueOnce({ raw: 'mockRaw', affectedRows: 1 }), // execute 메서드 추가
        }),
        getOne: jest.fn().mockResolvedValue(mockPlanner) 
      })),
     
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlannerService,
        {
          provide : getRepositoryToken(Planner),
          useValue : plannerRepository,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: taskRepository,
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PlannerService>(PlannerService);
    dataSource = module.get<DataSource>(DataSource);
  });

  const mockUser = {
    user_id: 1,
    email: "test@test.com",
    password: "testpassword",
    name: "testname",
  } as User;

  const mockPlanner = {
    plannerId: 1,
    user: mockUser, 
    description: "testdescription",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Planner;

  const mockTask = {
    taskId: 1,
    planner: mockPlanner,
    todo: "할 일 내용",
    startDate: new Date("2024-04-02"), 
    // endDate: new Date("2024-04-02"), 
    // startTime: new Date("2024-04-02T12:00:00.000Z"),
    // endTime: new Date("2024-04-02T12:00:00.000Z"),
    createdAt: new Date("2024-04-02T09:00:00.000Z"), 
    updatedAt: new Date("2024-04-02T09:30:00.000Z"), 
    authSum: 0,
    authDate: new Date("2024-04-02"), 
    authYn: false,
    checkYn: false,
  } as Task;

  const mockPlannerDto = {
    name : "플래너 이름",
    description : "플래너 설명"
  }

  const mockDateDto = {
    year : 2024,
    month : 4
  }

  const mockTaskDto = {
    todo: '할 일 내용',
    startDate: new Date(),
    // endDate: new Date(),
    // startTime: new Date(),
    // endTime: new Date(),
    planner: mockPlanner,
    authSum: 0, 
    authDate: new Date(), 
    authYn: false,
    checkYn: false 
};

  // it('마이페이지 접근 - service', async () => {  
  //   const result = await service.myPage(mockUser);

  //   expect(result).toEqual({ month_tasks_list: [mockTask], today_task: [mockTask], planner_info: mockPlanner });
  // });

  it('플래너 정보 수정 - service', async () => {
    const mockPlannerId = 1;

    const result = await service.updatePlanner(mockPlannerDto, mockPlannerId);
    expect(result).toEqual({ raw: 'mockRaw', affectedRows: 1 });
  });

  it('일정 등록 - service', async () => {
    const mockPlannerId = 1;

    const result = await service.postTodo(mockTaskDto, mockPlannerId);
    expect(result).toEqual([mockTask]);
  });

  it('일정 수정 - service', async () => {
    const taskId = 1;

    const result = await service.updateTodo(taskId, mockTaskDto);
    expect(result).toEqual([mockTask]);
  });
  
});
