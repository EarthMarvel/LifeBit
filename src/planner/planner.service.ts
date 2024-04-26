import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planner } from './entity/planner.entity';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Task } from './entity/task.entity';
import { PlannerDto } from './dto/update.planner.dto';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';

@Injectable()
export class PlannerService {
  constructor(
    @InjectRepository(Planner)
    private readonly plannerRepository: Repository<Planner>, //사용자가 회원가입 하면 자동으로 planner row 도 생성된다.
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    // //테스트 용도
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly dataSouce: DataSource, //커넥션 풀에서 커넥션(-> 트랜잭션) 가져오기
  ) {}

  // //프론트 테스트 용도
  //   async myPage(userId : number, startDate?: Date) {

  //     const user = await this.userRepository.findOne({ where: { user_id : userId } });
  //     const exist = await this.plannerRepository.findOneBy({ user });

  //     //플래너가 없을 경우 새로 생성
  //     if (!exist) {
  //       return await this.plannerRepository.save({
  //         user,
  //       });
  //     }

  //     //할 일 조회
  //     let query = await this.taskRepository
  //         .createQueryBuilder('task')
  //         .select([
  //           'task.todo',
  //           'task.startDate',
  //           'task.taskId',
  //           'task.authSum',
  //           'task.checkYn',
  //         ])
  //         .innerJoin(Planner, 'planner', 'task.plannerId = planner.planner_id')
  //         .where('planner.userId = :userId', { userId: user.user_id });

  //       if (startDate) {
  //           query = query.andWhere('task.startDate = :startDate', { startDate });
  //       }

  //       // 현재 날짜를 기준으로 작업을 필터링
  //       if (!startDate) {
  //           query = query
  //               .andWhere('task.startDate = CURDATE()');
  //       }

  //     const today_task = await query.getMany();

  //     //플래너 정보 조회
  //     const planner_info = await this.plannerRepository
  //       .createQueryBuilder('planner')
  //       .select(['planner.description', 'planner.plannerId'])
  //       .where('planner.userId = :userId', { userId: user.user_id })
  //       .getOne();

  //     return {
  //       today_task,
  //       planner_info,
  //     };
  //   }

  /**
   * 플래너 접속
   * @param userId
   * @returns
   */
  async myPage(user: User, startDate?: Date) {
    const exist = await this.plannerRepository.findOneBy({ user });

    //플래너가 없을 경우 새로 생성
    if (!exist) {
      return await this.plannerRepository.save({
        user,
      });
    }

    //할 일 조회
    let query = await this.taskRepository
      .createQueryBuilder('task')
      .select([
        'task.todo',
        'task.startDate',
        'task.taskId',
        'task.authSum',
        'task.checkYn',
      ])
      .innerJoin(Planner, 'planner', 'task.plannerId = planner.planner_id')
      .where('planner.userId = :userId', { userId: user.user_id });

    if (startDate) {
      query = query.andWhere('task.startDate = :startDate', { startDate });
    }

    // 현재 날짜를 기준으로 작업을 필터링
    if (!startDate) {
      query = query.andWhere('task.startDate = CURDATE()');
    }

    const today_task = await query.getMany();

    //플래너 정보 조회
    const planner_info = await this.plannerRepository
      .createQueryBuilder('planner')
      .select(['planner.description', 'planner.plannerId'])
      .where('planner.userId = :userId', { userId: user.user_id })
      .getOne();

    return {
      today_task,
      planner_info,
    };
  }

  /**
   * 플래너 정보 수정
   * @param plannerDto
   * @param plannerId
   * @returns
   */
  async updatePlanner(plannerDto: PlannerDto, plannerId: number) {
    const updatedPlanner = await this.plannerRepository
      .createQueryBuilder()
      .update('planner')
      .set({ description: plannerDto.description })
      .where('planner.planner_id = :plannerId', { plannerId })
      .execute();

    return updatedPlanner;
  }

  /**
   * 일정 등록
   * @param taskDto
   * @param plannerId
   * @returns
   */
  async postTodo(taskDto: TaskDto, plannerId: number) {
    const planner = await this.plannerRepository.findOneBy({ plannerId });

    if (!planner) {
      throw new NotFoundException('존재하지 않는 플래너입니다.');
    }

    const task = await this.taskRepository
      .createQueryBuilder()
      .insert()
      .into('task')
      .values({
        todo: taskDto.todo,
        startDate: taskDto.startDate,
        // startTime: taskDto.startTime,
        // endTime: taskDto.endTime,
        authDate: this.getToday(),
        planner: planner,
      })
      .execute();

    return task;
  }

  /**
   * 일정 수정
   * @param taskId
   * @param taskDto
   * @returns
   */
  async updateTodo(taskId: number, taskDto: TaskDto) {
    const updatedTodo = await this.taskRepository.findOneBy({ taskId: taskId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

    const plan = this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({
        todo: taskDto.todo,
        startDate: taskDto.startDate,
      })
      .where('task_id = :taskId', { taskId })
      .execute();
    return plan;
  }

  /**
   * 일정 삭제
   * @param taskId
   */
  async deleteTodo(taskId: number) {
    const updatedTodo = await this.taskRepository.findOneBy({ taskId: taskId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('task_id = :taskId', { taskId })
      .execute();
  }

  /**
   * 일정 체크 / 언체크
   * @param taskId
   */
  async checkTodo(taskId: number) {
    const updatedTodo = await this.taskRepository.findOneBy({ taskId: taskId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }
    updatedTodo.checkYn = !updatedTodo.checkYn;

    await this.taskRepository.save(updatedTodo);
  }

  /**
   * 일정 인증
   * @param taskId
   */
  async authTodo(taskId: number) {
    const task = await this.taskRepository.findOneBy({ taskId });

    if (!task) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

    //인증은 24시간만 가능하다.
    const today = this.getToday(); //2024-04-11T18:44:36.265Z
    const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD 형식의 문자열

    const taskDate = new Date(task.authDate);

    console.log(dateString); //2024-04-11
    console.log(task.authDate); //2024-04-11

    if (taskDate.toISOString().slice(0, 10) !== dateString) {
      throw new ForbiddenException('인증할 수 없습니다');
    }

    if (task.authYn) {
      throw new ForbiddenException('이미 인증을 완료했습니다.');
    }

    task.authYn = true;
    task.authSum += 1;
    return await this.taskRepository.save(task);
  }

  private getToday() {
    const todayUTC = new Date();
    const todayKoreanTime = new Date(todayUTC.getTime() + 9 * 60 * 60 * 1000);

    return todayKoreanTime;
  }

  async mission(userId: number) {
    const missions = await this.missionRepository
      .createQueryBuilder('mission')
      .select([
        'mission.missionId',
        'mission.category',
        'mission.title',
        'mission.description',
        'mission.startDate',
        'mission.endDate',
        'mission.numberPeople',
        'mission.thumbnailUrl',
        'mission.type',
        'mission.authSum',
      ])
      .where((qb: SelectQueryBuilder<any>) => {
        const subQuery = qb
          .subQuery()
          .select('mission_mission_id')
          .from('user_missions_mission', 'umm')
          .where('umm.User_user_id = :userId', { userId })
          .getQuery();
        return `mission.mission_id IN ${subQuery}`;
      })
      .getRawMany();
  }
}
