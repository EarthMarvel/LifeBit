import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planner } from './entity/planner.entity';
import { Repository } from 'typeorm';
import { Plan } from './entity/plan.entity';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';

@Injectable()
export class PlannerService {
  constructor(
    @InjectRepository(Planner)
    private readonly plannerRepository: Repository<Planner>, //사용자가 회원가입 하면 자동으로 planner row 도 생성된다.
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async myPage(userId: number) {
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .select(['plan.todo', 'plan.startDate', 'plan.endDate'])
      .innerJoin(Planner, 'planner', 'plan.plannerId = planner.planner_id')
      .where('planner.user_id = :userId', { userId })
      .andWhere(
        'year(plan.start_date) * 12 + month(plan.start_date) <= year(now()) * 12 + month(now())',
      )
      .andWhere(
        'year(plan.end_date) * 12 + month(plan.end_date) >= year(now()) * 12 + month(now())',
      )
      .orderBy('plan.start_date')
      .getMany();

    const today = await this.planRepository
      .createQueryBuilder('plan')
      .select([
        'plan.todo',
        'plan.startDate',
        'plan.endDate',
        'plan.startTime',
        'plan.endTime',
        'plan.planId',
        'plan.authYn',
        'plan.checkYn',
      ])
      .innerJoin(Planner, 'planner', 'plan.plannerId = planner.planner_id')
      .where('planner.user_id = :userId', { userId })
      .andWhere('plan.start_date <= CURDATE()')
      .andWhere('plan.end_date >= CURDATE()')
      .getMany();

    const planner = await this.plannerRepository
      .createQueryBuilder('planner')
      .select(['planner.name', 'planner.description', 'planner.plannerId']) //엔티티로 select
      .where('planner.user_id = :userId', { userId }) //쿼리
      .getOne(); //쿼리 실행

    return {
      plans,
      today,
      planner,
    };
  }

  async getPlanner(dateDto: DateDto, plannerId: number) {
    return await this.planRepository
      .createQueryBuilder('plan')
      .select([
        'plan.todo',
        'plan.startDate',
        'plan.endDate',
        'planner.plannerId',
      ])
      .innerJoin('plan.planner', 'planner')
      .where('planner.planner_id = :plannerId', { plannerId })
      .andWhere(
        'year(plan.start_date) * 12 + month(plan.start_date) <= :year * 12 + :month',
        { year: dateDto.year, month: dateDto.month },
      )
      .andWhere(
        'year(plan.end_date) * 12 + month(plan.end_date) >= :year * 12 + :month',
        { year: dateDto.year, month: dateDto.month },
      )
      .orderBy('plan.start_date')
      .getMany();
  }

  async updatePlanner(plannerDto: PlannerDto, plannerId: number) {
    const updatedPlanner = await this.plannerRepository
      .createQueryBuilder()
      .update('planner')
      .set({ name: plannerDto.name, description: plannerDto.description })
      .where('planner.planner_id = :plannerId', { plannerId })
      .execute();

    return updatedPlanner;
  }

  async postTodo(todoDto: TodoDto, plannerId: number) {
    const planner = await this.plannerRepository.findOneBy({ plannerId });

    if (!planner) {
      throw new NotFoundException('존재하지 않는 플래너입니다.');
    }

    const plan = await this.planRepository
      .createQueryBuilder()
      .insert()
      .into('plan')
      .values({
        todo: todoDto.todo,
        startDate: todoDto.startDate,
        endDate: todoDto.endDate,
        startTime: todoDto.startTime,
        endTime: todoDto.endTime,
        ifMission: todoDto.ifMission,
        thenMissionId: todoDto.thenMissionId,
        planner: planner,
      })
      .execute();

    return plan;
  }

  async updateTodo(planId: number, todoDto: TodoDto) {
    const updatedTodo = await this.planRepository.findOneBy({ planId: planId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

    const plan = this.planRepository
      .createQueryBuilder()
      .update(Plan)
      .set({
        todo: todoDto.todo,
        startDate: todoDto.startDate,
        endDate: todoDto.endDate,
        startTime: todoDto.startTime,
        endTime: todoDto.endTime,
        ifMission: todoDto.ifMission,
        thenMissionId: todoDto.thenMissionId,
      })
      .where('plan_id = :planId', { planId })
      .execute();
    return plan;
  }

  async deleteTodo(planId: number) {
    const updatedTodo = await this.planRepository.findOneBy({ planId: planId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }

    await this.planRepository
      .createQueryBuilder()
      .delete()
      .from(Plan) // Plan 엔티티에서 삭제합니다.
      .where('plan_id = :planId', { planId })
      .execute();
  }

  async checkTodo(planId: number) {
    const updatedTodo = await this.planRepository.findOneBy({ planId: planId });

    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }
    updatedTodo.checkYn = !updatedTodo.checkYn;

    await this.planRepository.save(updatedTodo);
  }

  async authTodo(planId: number) {
    const updatedTodo = await this.planRepository.findOneBy({ planId: planId });

    //트랜잭션 - 포인트 엔티티 1 증가
    if (!updatedTodo) {
      throw new NotFoundException('존재하지 않는 일정입니다.');
    }
    updatedTodo.authYn = true;

    await this.planRepository.save(updatedTodo);
  }
}
