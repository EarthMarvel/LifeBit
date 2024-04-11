import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planner } from './entity/planner.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PlannerService {
    constructor(
        @InjectRepository(Planner) 
        private readonly plannerRepository : Repository<Planner>, //사용자가 회원가입 하면 자동으로 planner row 도 생성된다.
        @InjectRepository(Task)
        private readonly taskRepository : Repository<Task>,
        private readonly dataSouce : DataSource //커넥션 풀에서 커넥션(-> 트랜잭션) 가져오기
    ) {}

  /**
   * 마이페이지 접근 (만약 user 가 없다면 빈 플래너 생성해서 보내기)
   * @param userId
   * @returns
   */
  async myPage(user: User) {
    console.log(user);
    const exist = await this.plannerRepository.findOneBy({ user });

    //플래너가 없을 경우 새로 생성
    if (!exist) {
      return await this.plannerRepository.save({
        user,
      });
    }

    const month_tasks_list = await this.taskRepository
        .createQueryBuilder('task')
        .select(['task.todo', 'task.startDate', 'task.endDate'])
        .innerJoin(Planner, 'planner', 'task.plannerId = planner.planner_id')
        .where('planner.userId = :userId', {userId : user.user_id})
        .andWhere('year(task.start_date) * 12 + month(task.start_date) <= year(now()) * 12 + month(now())')
        .andWhere('year(task.end_date) * 12 + month(task.end_date) >= year(now()) * 12 + month(now())')
        .orderBy('task.start_date')
        .getMany();

    const today_task = await this.taskRepository
        .createQueryBuilder('task')
        .select([
            'task.todo', 
            'task.startDate', 
            'task.endDate', 
            'task.startTime', 
            'task.endTime', 
            'task.taskId', 
            'task.authSum', 
            'task.checkYn'
            ])
        .innerJoin(Planner, 'planner', 'task.plannerId = planner.planner_id')
        .where('planner.userId = :userId', {userId : user.user_id})
        .andWhere('task.start_date <= CURDATE()')
        .andWhere('task.end_date >= CURDATE()')
        .getMany();

    const planner_info = await this.plannerRepository
            .createQueryBuilder('planner')
            .select(['planner.name', 'planner.description', 'planner.plannerId']) //엔티티로 select
            .where('planner.userId = :userId', {userId : user.user_id}) //쿼리
            .getOne(); //쿼리 실행
    
    return {
        month_tasks_list, today_task, planner_info
    }
    
}

    /**
     * 플래너 조회
     * @param dateDto 
     * @param plannerId 
     * @returns 
     */
    async getPlanner(dateDto : DateDto, plannerId: number) {

        return await this.taskRepository
            .createQueryBuilder('task')
            .select(['task.todo', 'task.startDate', 'task.endDate', 'planner.plannerId'])
            .innerJoin('task.planner', 'planner')
            .where('planner.planner_id = :plannerId', {plannerId})
            .andWhere('year(task.start_date) * 12 + month(task.start_date) <= :year * 12 + :month', 
                {year : dateDto.year, month : dateDto.month})
            .andWhere('year(task.end_date) * 12 + month(task.end_date) >= :year * 12 + :month',
                {year : dateDto.year, month : dateDto.month})
            .orderBy('task.start_date')
            .getMany();

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
      .set({ name: plannerDto.name, description: plannerDto.description })
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
    async postTodo(taskDto : TaskDto, plannerId : number) {

        const planner = await this.plannerRepository.findOneBy({plannerId});

        if (!planner) {
        throw new NotFoundException('존재하지 않는 플래너입니다.');
        }

        const task = await this.taskRepository
            .createQueryBuilder()
            .insert()
            .into('task')
            .values({
                todo : taskDto.todo, 
                startDate : taskDto.startDate,
                endDate : taskDto.endDate,
                startTime : taskDto.startTime,
                authDate : this.getToday(),
                endTime : taskDto.endTime,
                planner : planner
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
    async updateTodo(taskId: number, taskDto : TaskDto) {

    const updatedTodo = await this.taskRepository.findOneBy({taskId : taskId});

        if (!updatedTodo) {
        throw new NotFoundException('존재하지 않는 일정입니다.');
        }

        const plan =  this.taskRepository
            .createQueryBuilder()
            .update(Task) 
            .set({
                todo: taskDto.todo,
                startDate: taskDto.startDate,
                endDate: taskDto.endDate,
                startTime: taskDto.startTime,
                endTime: taskDto.endTime,
            })
            .where("task_id = :taskId", { taskId })
            .execute();
        return plan;
    }
    
    /**
     * 일정 삭제
     * @param taskId 
     */
    async deleteTodo(taskId: number) {

        const updatedTodo = await this.taskRepository.findOneBy({taskId : taskId});

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

        await this.taskRepository
            .createQueryBuilder()
            .delete()
            .from(Task)
            .where("task_id = :taskId", { taskId })
            .execute();
    }
    
    /**
     * 일정 체크 / 언체크
     * @param taskId
     */
    async checkTodo(taskId: number) {
        const updatedTodo = await this.taskRepository.findOneBy({taskId : taskId});

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
        const task = await this.taskRepository.findOneBy({taskId});

        if (!task) {
            throw new NotFoundException('존재하지 않는 일정입니다.');
        }

        //인증은 24시간만 가능하다.
        const today = this.getToday();//2024-04-11T18:44:36.265Z
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
        const todayKoreanTime = new Date(todayUTC.getTime() + (9 * 60 * 60 * 1000));
    
        return todayKoreanTime;
    }
}
