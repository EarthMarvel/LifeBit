import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planner } from './entity/planner.entity';
import { DataSource, Repository } from 'typeorm';
import { Plan } from './entity/plan.entity';
import { DateDto } from './dto/get.planner.dto';
import { PlannerDto } from './dto/update.planner.dto';
import { Point } from '../point/entity/point.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PlannerService {
    constructor(
        @InjectRepository(Planner) 
        private readonly plannerRepository : Repository<Planner>, //사용자가 회원가입 하면 자동으로 planner row 도 생성된다.
        @InjectRepository(Plan)
        private readonly planRepository : Repository<Plan>,
        private readonly dataSouce : DataSource //커넥션 풀에서 커넥션(-> 트랜잭션) 가져오기
    ) {}

    /**
     * 마이페이지 접근 (만약 user 가 없다면 빈 플래너 생성해서 보내기)
     * @param userId 
     * @returns 
     */
    async myPage(user : User) {

        const exist = await this.plannerRepository.findOneBy({user});

        //플래너가 없을 경우 새로 생성
        if (!exist) {
            return await this.plannerRepository.save({
                user
            });
        }

        const month_plans = await this.planRepository
            .createQueryBuilder('plan')
            .select(['plan.todo', 'plan.startDate', 'plan.endDate'])
            .innerJoin(Planner, 'planner', 'plan.plannerId = planner.planner_id')
            .where('planner.userId = :userId', {userId : user.user_id})
            .andWhere('year(plan.start_date) * 12 + month(plan.start_date) <= year(now()) * 12 + month(now())')
            .andWhere('year(plan.end_date) * 12 + month(plan.end_date) >= year(now()) * 12 + month(now())')
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
                'plan.checkYn'
              ])
            .innerJoin(Planner, 'planner', 'plan.plannerId = planner.planner_id')
            .where('planner.userId = :userId', {userId : user.user_id})
            .andWhere('plan.start_date <= CURDATE()')
            .andWhere('plan.end_date >= CURDATE()')
            .getMany();

        const planner_info = await this.plannerRepository
              .createQueryBuilder('planner')
              .select(['planner.name', 'planner.description', 'planner.plannerId']) //엔티티로 select
              .where('planner.userId = :userId', {userId : user.user_id}) //쿼리
              .getOne(); //쿼리 실행
        
        return {
            month_plans, today, planner_info
        }
        
    }

    /**
     * 플래너 조회
     * @param dateDto 
     * @param plannerId 
     * @returns 
     */
    async getPlanner(dateDto : DateDto, plannerId: number) {

        return await this.planRepository
            .createQueryBuilder('plan')
            .select(['plan.todo', 'plan.startDate', 'plan.endDate', 'planner.plannerId'])
            .innerJoin('plan.planner', 'planner')
            .where('planner.planner_id = :plannerId', {plannerId})
            .andWhere('year(plan.start_date) * 12 + month(plan.start_date) <= :year * 12 + :month', 
                {year : dateDto.year, month : dateDto.month})
            .andWhere('year(plan.end_date) * 12 + month(plan.end_date) >= :year * 12 + :month',
                {year : dateDto.year, month : dateDto.month})
            .orderBy('plan.start_date')
            .getMany();

    }

    /**
     * 플래너 정보 수정
     * @param plannerDto 
     * @param plannerId 
     * @returns 
     */
    async updatePlanner(plannerDto: PlannerDto, plannerId : number) {

        const updatedPlanner = await this.plannerRepository
            .createQueryBuilder()
            .update('planner')
            .set({name : plannerDto.name, description : plannerDto.description})
            .where('planner.planner_id = :plannerId', {plannerId})
            .execute();

        return updatedPlanner;
    }

    /**
     * 일정 등록
     * @param todoDto 
     * @param plannerId 
     * @returns 
     */
    async postTodo(todoDto: TodoDto, plannerId : number) {

        const planner = await this.plannerRepository.findOneBy({plannerId});

        if (!planner) {
            throw new NotFoundException('존재하지 않는 플래너입니다.');
        }

        const plan = await this.planRepository
            .createQueryBuilder()
            .insert()
            .into('plan')
            .values({
                todo : todoDto.todo,
                startDate : todoDto.startDate,
                endDate : todoDto.endDate,
                startTime : todoDto.startTime,
                endTime : todoDto.endTime,
                ifMission : todoDto.ifMission,
                thenMissionId : todoDto.thenMissionId,
                planner : planner
            })
            .execute();

        return plan;
    }
    
    /**
     * 일정 수정
     * @param planId 
     * @param todoDto 
     * @returns 
     */
    async updateTodo(planId: number, todoDto: TodoDto) {

        const updatedTodo = await this.planRepository.findOneBy({planId : planId});

        if (!updatedTodo) {
            throw new NotFoundException('존재하지 않는 일정입니다.');
        }

        const plan =  this.planRepository
            .createQueryBuilder()
            .update(Plan) 
            .set({
                todo: todoDto.todo,
                startDate: todoDto.startDate,
                endDate: todoDto.endDate,
                startTime: todoDto.startTime,
                endTime: todoDto.endTime,
                ifMission: todoDto.ifMission,
                thenMissionId: todoDto.thenMissionId
            })
            .where("plan_id = :planId", { planId })
            .execute();
        return plan;
    }
    
    /**
     * 일정 삭제
     * @param planId 
     */
    async deleteTodo(planId: number) {

        const updatedTodo = await this.planRepository.findOneBy({planId : planId});

        if (!updatedTodo) {
            throw new NotFoundException('존재하지 않는 일정입니다.');
        }

        await this.planRepository
            .createQueryBuilder()
            .delete()
            .from(Plan)
            .where("plan_id = :planId", { planId })
            .execute();
    }
    
    /**
     * 일정 체크 / 언체크
     * @param planId
     */
    async checkTodo(planId: number) {
        const updatedTodo = await this.planRepository.findOneBy({planId : planId});

        if (!updatedTodo) {
            throw new NotFoundException('존재하지 않는 일정입니다.');
        }
        updatedTodo.checkYn = !updatedTodo.checkYn;

        await this.planRepository.save(updatedTodo);
    }
    
    /**
     * 일정 인증
     * @param planId
     */
    async authTodo(planId: number, user : User) {
        const updatedTodo = await this.planRepository.findOneBy({planId});

        if (!updatedTodo) {
            throw new NotFoundException('존재하지 않는 일정입니다.');
        }
    
        updatedTodo.authYn = true;     
        await this.planRepository.save(updatedTodo);
    }
}
