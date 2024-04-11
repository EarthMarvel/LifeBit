import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Planner } from './planner.entity';

/**
 * {
  "taskId": 1,
  "planner": {},
  "todo": "할 일 내용",
  "startDate": "2024-04-02", // 특정 날짜만 받음
  "endTime": "12:00", // 시간과 분만 받음
  "createdAt": "2024-04-02T09:00:00.000Z", // 자동으로 현재 시간을 받음
  "updatedAt": "2024-04-02T09:30:00.000Z" // 자동으로 수정된 시간을 받음
}
*/

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn()
  taskId: number;

  @ManyToOne(() => Planner, (planner) => planner.task)
  @JoinColumn({ name: 'plannerId' })
  planner: Planner;

  @Column({ type: 'varchar', nullable: false })
  todo: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'time', precision: 0 })
  startTime: Date;

  @Column({ type: 'time', precision: 0 })
  endTime: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  // 서버 실행할 때 오류 이슈로 잠시 주석!
  // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  // 서버 실행할 때 오류 이슈로 잠시 주석!
  // @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updatedAt: Timestamp;

  @Column({ default: 0 }) // 기본값은 false
  authSum: number;

  @Column({ type: 'date' })
  authDate: Date;

    @Column({type : 'boolean', default: false})
    authYn : boolean;

  @Column({ type: 'boolean', default: false }) // 기본값은 false
  checkYn: boolean;
}
