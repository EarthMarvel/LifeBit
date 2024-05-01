import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/planner/entity/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class SchedulerService {

    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectRepository(Task)
        private readonly taskRepository : Repository<Task>
    ) {}

    //@Interval(60000) //1분 뒤 시작
    @Cron('0 0 * * *') //매일 자정 실행
    async taskHandle() {
        this.logger.log('Initialize to-do authentication')

        //오늘 할 일 처리하는 작업 수행
        const todayUTC = new Date();
        const todayKoreanTime = new Date(todayUTC.getTime() + (9 * 60 * 60 * 1000));
        const dateString = todayKoreanTime.toISOString().slice(0, 10); // YYYY-MM-DD 형식의 문자열

        const taskDate = new Date(dateString);

        const todoList = await this.taskRepository
        .createQueryBuilder('task')
        .where('task.start_date = :today', { today: dateString })
        .getMany();

        for (const task of todoList) {
            task.authYn = false;
            task.authDate = taskDate
        }

        await this.taskRepository.save(todoList);
    }
}