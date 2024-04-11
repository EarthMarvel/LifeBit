import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/planner/entity/task.entity";
import { PlannerService } from "src/planner/planner.service";
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todoList = await this.taskRepository
            .createQueryBuilder('task')
            .where(':today between task.start_date and task.end_date', {today})
            .getMany();

        for (const task of todoList) {
            task.authYn = false;
            task.authDate = today
        }

        await this.taskRepository.save(todoList);
    }
}