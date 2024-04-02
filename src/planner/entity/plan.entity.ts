import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Planner } from "./planner.entity";

/**
 * {
  "planId": 1,
  "planner": {},
  "todo": "할 일 내용",
  "startDate": "2024-04-02", // 특정 날짜만 받음
  "endTime": "12:00", // 시간과 분만 받음
  "createdAt": "2024-04-02T09:00:00.000Z", // 자동으로 현재 시간을 받음
  "updatedAt": "2024-04-02T09:30:00.000Z" // 자동으로 수정된 시간을 받음
}
*/

@Entity({name : 'plan'})
export class Plan {

    @PrimaryGeneratedColumn()
    planId : number;

    @ManyToOne(() => Planner, (planner) => planner.plan)
    @JoinColumn({name : 'plannerId'})
    planner : Planner

    @Column({type : 'varchar', nullable : false})
    todo : string

    @Column({ type: 'date' }) 
    startDate: Date;

    @Column({ type: 'date' }) 
    endDate: Date;
    
    @Column({ type: 'time', precision: 0 })
    startTime: Date;

    @Column({ type: 'time', precision: 0 })
    endTime: Date;
    
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: false }) // 기본값은 false
    authYn: boolean;

    @Column({ type: 'boolean', default: false }) // 기본값은 false
    checkYn: boolean;

    @Column({ type: 'boolean', default: false }) // 기본값은 false
    ifMission : boolean;

    @Column()
    thenMissionId : number;
}